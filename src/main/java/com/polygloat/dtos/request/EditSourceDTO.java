package com.polygloat.dtos.request;


import com.polygloat.dtos.PathDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditSourceDTO {
    @NotBlank
    private String oldFullPathString;

    @NotBlank
    @Size(min = 1, max = 300)
    private String newFullPathString;

    public PathDTO getOldPathDto() {
        return PathDTO.fromFullPath(oldFullPathString);
    }

    public PathDTO getNewPathDto() {
        return PathDTO.fromFullPath(newFullPathString);
    }
}
