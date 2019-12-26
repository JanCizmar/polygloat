package com.polygloat.repository;

import com.polygloat.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    Optional<File> findByRepositoryAndMaterializedPathAndName(com.polygloat.model.Repository repository,
                                                              @NotNull String materializedPath,
                                                              @Size(min = 1, max = 200) String name);
}
