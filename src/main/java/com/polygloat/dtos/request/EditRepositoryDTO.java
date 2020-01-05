package com.polygloat.dtos.request;

import com.polygloat.dtos.request.validators.annotations.RepositoryRequest;
import lombok.Getter;
import lombok.Setter;

@RepositoryRequest
public class EditRepositoryDTO extends AbstractRepositoryDTO {
    @Getter
    @Setter
    Long repositoryId;


    public EditRepositoryDTO(Long repositoryId, String name) {
        this.repositoryId = repositoryId;
        this.name = name;
    }
}
