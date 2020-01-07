package com.polygloat.service;

import com.polygloat.dtos.PathDTO;
import com.polygloat.dtos.query_results.FileDTO;
import com.polygloat.dtos.response.ViewDataResponse;
import com.polygloat.dtos.response.translations_view.FileViewDataItem;
import com.polygloat.dtos.response.translations_view.ResponseParams;
import com.polygloat.exceptions.FileAlreadyExists;
import com.polygloat.exceptions.InvalidPathException;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.repository.FileRepository;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.service.query_builders.TranslationsViewBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FileService {

    private FileRepository fileRepository;
    private RepositoryRepository repositoryRepository;
    private EntityManager entityManager;
    private LanguageService languageService;

    @Autowired
    public FileService(FileRepository fileRepository,
                       RepositoryRepository repositoryRepository,
                       EntityManager entityManager,
                       LanguageService languageService) {
        this.fileRepository = fileRepository;
        this.repositoryRepository = repositoryRepository;
        this.entityManager = entityManager;
        this.languageService = languageService;
    }

    public File getOrCreatePath(Repository repository, PathDTO path) {
        List<String> fullPath = path.getFullPath();

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
    public ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> getViewData(Set<String> languages, Long repositoryId, int offset, int limit, String search) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        if (languages == null || languages.isEmpty()) {
            languages = languageService.getDefaultLanguagesForView(repository);
        }

        //check language exists
        for (String language : languages) {
            if (!languageService.findByAbbreviation(language, repository).isPresent()) {
                throw new NotFoundException();
            }
        }

        TranslationsViewBuilder translationsViewBuilder = new TranslationsViewBuilder(this.entityManager.getCriteriaBuilder(), repository, languages, search);
        CriteriaQuery<Object> dataQuery = translationsViewBuilder.getDataQuery();

        LinkedHashSet<FileViewDataItem> fileDTOs = this.entityManager.createQuery(dataQuery).setFirstResult(offset).setMaxResults(limit)
                .getResultList()
                .stream().map(i -> new FileDTO((Object[]) i)).map(FileViewDataItem::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        translationsViewBuilder = new TranslationsViewBuilder(this.entityManager.getCriteriaBuilder(), repository, languages, search);

        Long allCount = this.entityManager.createQuery(translationsViewBuilder.getCountQuery()).getSingleResult();

        return new ViewDataResponse<>(fileDTOs, offset, allCount, new ResponseParams(search, languages));
    }

    @Transactional
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

    @Transactional
    public void deleteFile(Long repositoryId, PathDTO sourcePath) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
        this.deleteFile(this.evaluatePath(repository, sourcePath).orElseThrow(NotFoundException::new));
    }
}
