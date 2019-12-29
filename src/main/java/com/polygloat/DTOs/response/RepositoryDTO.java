package com.polygloat.DTOs.response;

import com.polygloat.model.Repository;
import lombok.Getter;
import lombok.Setter;

public class RepositoryDTO {
    @Getter
    @Setter
    Long id;

    @Getter
    @Setter
    String name;

    public RepositoryDTO() {
    }

    public RepositoryDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static RepositoryDTO fromEntity(Repository repository) {
        return new RepositoryDTO(repository.getId(), repository.getName());
    }

}
