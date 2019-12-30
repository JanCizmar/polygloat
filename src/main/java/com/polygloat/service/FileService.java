package com.polygloat.service;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.queryResults.FileDTO;
import com.polygloat.Exceptions.FileAlreadyExists;
import com.polygloat.Exceptions.InvalidPathException;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.repository.FileRepository;
import com.polygloat.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileService {

    private FileRepository fileRepository;
    private RepositoryRepository repositoryRepository;
    private EntityManager entityManager;

    @Autowired
    public FileService(FileRepository fileRepository,
                       RepositoryRepository repositoryRepository,
                       EntityManager entityManager) {
        this.fileRepository = fileRepository;
        this.repositoryRepository = repositoryRepository;
        this.entityManager = entityManager;
    }

    public File getOrCreatePath(Repository repository, PathDTO path) {
        LinkedList<String> fullPath = path.getFullPath();

        File parent = repository.getRootFolder();

        boolean parentCreated = false;
        for (String item : fullPath) {
            File file = null;
            if (!parentCreated) {
                //if parent was just created, dont try to retrieve the folder from db, it just can't exist
                file = parent.getChild(item);
            }
            if (file == null) {
                if (!parent.isFolder()) {
                    throw new IllegalStateException("Can not set non-directory file as parent");
                }
                file = new File();
                file.setName(item);
                file.setRepository(repository);
                file.setParent(parent);
                parent.getChildren().add(file);
                fileRepository.save(file);
                parentCreated = true;
            }
            parent = file;
        }
        return parent;
    }


    private void validateMove(Repository repository, PathDTO oldFilePath, PathDTO newFilePath) {

        if (oldFilePath == null) {
            return;
        }

        if (newFilePath.getFullPath().isEmpty() || (oldFilePath.getFullPath().isEmpty())) {
            throw new InvalidPathException();
        }

        PathDTO parent = newFilePath;
        while (!parent.getFullPath().isEmpty()) {
            if (parent.equals(oldFilePath)) {
                throw new InvalidPathException();
            }
            parent = parent.getParent();
        }

        Optional<File> file = this.evaluatePath(repository, newFilePath);

        if (file.isPresent()) {
            throw new FileAlreadyExists();
        }

    }

    @Transactional
    public File setFile(Long repositoryId, PathDTO oldFilePath, PathDTO newFilePath) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        validateMove(repository, oldFilePath, newFilePath);

        File oldFile = null;

        if (oldFilePath != null) {
            oldFile = evaluatePath(repository, oldFilePath).orElse(null);
        }

        if (oldFile != null) {
            if (!oldFilePath.getPath().equals(newFilePath.getPath())) {
                //paths are not equal - change parent
                File parent = getOrCreatePath(repository, newFilePath.getParent());
                oldFile.setParent(parent);
            }

            if (newFilePath.getName() == null || newFilePath.getName().isEmpty()) {
                throw new InvalidPathException();
            }

            oldFile.setName(newFilePath.getName());
            fileRepository.save(oldFile);
            return oldFile;
        }

        return getOrCreatePath(repository, newFilePath);
    }

    public Optional<File> evaluatePath(Repository repository, PathDTO pathDTO) {
        if (repository == null) {
            throw new NullPointerException();
        }
        return fileRepository.findByRepositoryAndMaterializedPathAndName(repository,
                pathDTO.getPathString(),
                pathDTO.getName());
    }

    @Transactional
    public LinkedHashSet<FileDTO> getDataForView(Repository repository, Set<String> abbrs) {
        CriteriaBuilder cb = this.entityManager.getCriteriaBuilder();

        CriteriaQuery<Object> query1 = cb.createQuery();
        Root<File> file = query1.from(File.class);
        Join<Object, Object> source = file.join("source", JoinType.LEFT);

        Set<Selection<?>> selection = new LinkedHashSet<>();

        Selection<String> fullPath = cb.concat(file.get("materializedPath"), cb.concat(".", file.get("name")))
                .alias("fullPath");

        selection.add(fullPath);

        selection.add(file.get("source").get("id"));

        Set<Predicate> restrictions = new HashSet<>();

        for (String abbr : abbrs) {
            Join<Object, Object> translations = source.join("translations", JoinType.LEFT);
            Join<Object, Object> language = translations.join("language", JoinType.LEFT);

            restrictions.add(cb.or(cb.equal(language.get("abbreviation"), abbr), cb.isNull(file.get("source"))));

            //query1.orderBy(cb.asc(translations.get("text")));
            selection.add(language.get("abbreviation"));
            selection.add(translations.get("text"));
        }

        Selection<?>[] paths = selection.toArray(new Selection<?>[0]);

        query1.multiselect(paths);
        query1.orderBy(cb.asc((Expression<?>) fullPath));
        restrictions.add(cb.equal(file.get("repository"), repository));
        restrictions.add(cb.isNotNull(file.get("name")));

        query1.where(restrictions.toArray(new Predicate[0]));

        return this.entityManager.createQuery(query1).getResultList()
                .stream().map(i -> new FileDTO((Object[]) i))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public void deleteFile(File fileEntity) {
        CriteriaBuilder cb = this.entityManager.getCriteriaBuilder();
        CriteriaDelete<File> delete = cb.createCriteriaDelete(File.class);
        Root<File> fileRoot = delete.from(File.class);

        Path<String> mPath = fileRoot.get("materializedPath");

        String oldPath = fileEntity.getOldPath().getFullPathString();

        String likeString = String.format("%s%%", oldPath);

        delete.where(cb.and(cb.equal(fileRoot.get("repository"), fileEntity.getRepository()), cb.like(mPath, likeString)));

        this.entityManager.createQuery(delete).executeUpdate();
        this.entityManager.clear();

        fileRepository.delete(fileEntity);
    }

    public void updateChildMaterializedPaths(File fileEntity) {
        CriteriaBuilder cb = this.entityManager.getCriteriaBuilder();
        CriteriaUpdate<File> update = cb.createCriteriaUpdate(File.class);
        Root<File> fileRoot = update.from(File.class);

        Path<String> mPath = fileRoot.get("materializedPath");

        String oldPath = fileEntity.getOldPath().getFullPathString();

        update.set(mPath, cb.concat(fileEntity.getPath().getFullPathString(), cb.substring(mPath, oldPath.length() + 1)));

        String likeString = String.format("%s%%", oldPath);

        update.where(cb.and(cb.equal(fileRoot.get("repository"), fileEntity.getRepository()), cb.like(mPath, likeString)));

        this.entityManager.createQuery(update).executeUpdate();
        this.entityManager.clear();
    }

    public void deleteFile(Long repositoryId, PathDTO sourcePath) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
        this.deleteFile(this.evaluatePath(repository, sourcePath).orElseThrow(NotFoundException::new));
    }
}
