package com.polygloat.service;

import com.polygloat.constants.Message;
import com.polygloat.dtos.PathDTO;
import com.polygloat.dtos.request.EditSourceDTO;
import com.polygloat.dtos.request.SetTranslationsDTO;
import com.polygloat.dtos.response.SourceDTO;
import com.polygloat.dtos.request.validators.exceptions.ValidationException;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.repository.SourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SourceService {

    private final SourceRepository sourceRepository;
    private final EntityManager entityManager;

    //circular dependency
    @Setter(onMethod = @__({@Autowired}))
    private TranslationService translationService;

    public Source getOrCreateSource(Repository repository, PathDTO path) {

        Source source = getSource(repository, path)
                .orElseGet(() ->
                        Source.builder()
                                .name(path.getFullPathString())
                                .repository(repository)
                                .build());

        entityManager.persist(source);

        return source;
    }

    public Optional<Source> getSource(Long repositoryId, PathDTO pathDTO) {
        return sourceRepository.getByNameAndRepositoryId(pathDTO.getFullPathString(), repositoryId);
    }

    public Optional<Source> getSource(Repository repository, PathDTO pathDTO) {
        return sourceRepository.getByNameAndRepository(pathDTO.getFullPathString(), repository);
    }

    public Optional<Source> getSource(Long id) {
        return sourceRepository.findById(id);
    }

    public void createSource(Repository repository, SourceDTO dto) {
        if (this.getSource(repository, dto.getPathDto()).isPresent()) {
            throw new ValidationException(Message.SOURCE_EXISTS);
        }
        Source source = Source.builder().name(dto.getFullPathString()).repository(repository).build();
        sourceRepository.save(source);
    }

    public void editSource(Repository repository, EditSourceDTO dto) {
        //do nothing on no change
        if (dto.getNewFullPathString().equals(dto.getOldFullPathString())) {
            return;
        }

        if (getSource(repository, dto.getNewPathDto()).isPresent()) {
            throw new ValidationException(Message.SOURCE_EXISTS);
        }

        Source source = getSource(repository, dto.getOldPathDto()).orElseThrow(NotFoundException::new);
        source.setName(dto.getNewFullPathString());
        sourceRepository.save(source);
    }

    public void deleteSource(Long id) {
        Source source = getSource(id).orElseThrow(NotFoundException::new);
        sourceRepository.delete(source);
    }

    @Transactional
    public void createSource(Repository repository, SetTranslationsDTO dto) {
        if (this.getSource(repository, PathDTO.fromFullPath(dto.getSourceFullPath())).isPresent()) {
            throw new ValidationException(Message.SOURCE_EXISTS);
        }

        Source source = Source.builder().name(dto.getSourceFullPath()).repository(repository).build();

        sourceRepository.save(source);
        translationService.setForSource(source, dto.getTranslations());
    }
}
