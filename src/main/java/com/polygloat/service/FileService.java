package com.polygloat.service;

import com.polygloat.DTOs.FolderDTO;
import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.QueryResults.FileDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.repository.FileRepository;
import com.polygloat.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        if (fullPath.isEmpty()) {
            throw new IllegalArgumentException("Can not create root folder - path is empty");
        }

        File parent = repository.getRootFolder();
        boolean parentCreated = false;
        for (String item : fullPath) {
            File folder = null;
            if (!parentCreated) {
                //if parent was just created, dont try to retrieve the folder from db, it just can't exist
                folder = parent.getChild(item);
            }
            if (folder == null) {
                if (!parent.isFolder()) {
                    throw new IllegalStateException("Can not set non-directory file as parent");
                }
                folder = new File();
                folder.setName(item);
                folder.setRepository(repository);
                folder.setParent(parent);
                fileRepository.save(folder);
                parentCreated = true;
            }
            parent = folder;
        }
        return parent;
    }

    public File setFolder(Long repositoryId, FolderDTO folderDTO) {
        return setFolder(repositoryId, null, folderDTO);
    }

    //todo change child materialized path on change
    public File setFolder(Long repositoryId, FolderDTO oldFolderDTO, FolderDTO newFolderDTO) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        File oldFolder = null;

        if (oldFolderDTO != null) {
            oldFolder = evaluatePath(repository, oldFolderDTO.getPath()).orElse(null);
        }

        if (oldFolder != null) {
            if (!oldFolder.getPath().getPath().equals(newFolderDTO.getPath().getPath())) {
                File parent = getOrCreatePath(repository, newFolderDTO.getPath());
                oldFolder.setParent(parent);
            }
            oldFolder.setName(newFolderDTO.getName());
            fileRepository.save(oldFolder);
            return oldFolder;
        }

        return getOrCreatePath(repository, newFolderDTO.getPath());
    }

    public void deleteFolder(Long repositoryId, PathDTO pathDTO) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        File folder = evaluatePath(repository, pathDTO).orElseThrow(NotFoundException::new);

        fileRepository.delete(folder);
    }


    public Optional<File> evaluatePath(Repository repository, PathDTO pathDTO) {
        if (repository == null) {
            throw new NullPointerException();
        }
        return fileRepository.findByRepositoryAndMaterializedPathAndName(repository,
                pathDTO.getPathString(),
                pathDTO.getName());
    }

    public LinkedHashSet<FileDTO> findAllInRepository(Repository repository, Set<String> abbrs) {
        CriteriaBuilder cb = this.entityManager.getCriteriaBuilder();

        CriteriaQuery<Object> query1 = cb.createQuery();
        Root<File> file = query1.from(File.class);
        Join<Object, Object> source = file.join("source", JoinType.LEFT);

        Set<Path<?>> selection = new LinkedHashSet<>();
        selection.add(file.get("materializedPath"));
        selection.add(file.get("name"));
        Set<Predicate> restrictions = new HashSet<>();

        for (String abbr : abbrs) {
            Join<Object, Object> translations = source.join("translations", JoinType.LEFT);
            Join<Object, Object> language = translations.join("language", JoinType.LEFT);

            restrictions.add(cb.or(cb.equal(language.get("abbreviation"), abbr), cb.isNull(file.get("source"))));

            query1.orderBy(cb.asc(translations.get("text")));
            selection.add(language.get("abbreviation"));
            selection.add(translations.get("text"));
        }

        Path<?>[] paths = selection.toArray(new Path<?>[0]);

        query1.multiselect(paths).distinct(true);

        restrictions.add(cb.equal(file.get("repository"), repository));
        restrictions.add(cb.isNotNull(file.get("name")));

        query1.where(restrictions.toArray(new Predicate[0]));

        return this.entityManager.createQuery(query1).getResultList()
                .stream().map(i -> new FileDTO((Object[]) i))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    public void updateChildMaterializedPaths(File fileEntity) {
        CriteriaBuilder cb = this.entityManager.getCriteriaBuilder();
        CriteriaUpdate<File> update = cb.createCriteriaUpdate(File.class);
        Root<File> fileRoot = update.from(File.class);

        Path<String> mPath = fileRoot.get("materializedPath");

        String oldPath = fileEntity.getPath().getPathString() + PathDTO.DELIMITER + fileEntity.getOldName();

        update.set(mPath, cb.concat(fileEntity.getPath().getFullPathString(), cb.substring(mPath, oldPath.length() + 1)));

        String likeString = String.format("%s%%", oldPath);

        update.where(cb.and(cb.equal(fileRoot.get("repository"), fileEntity.getRepository()), cb.like(mPath, likeString)));

        this.entityManager.createQuery(update).executeUpdate();
    }
}
