package com.polygloat.DTOs.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.polygloat.DTOs.PathDTO;
import lombok.Getter;

public class SetFileRequestDTO {
    @Getter
    private String oldFileFullPath;
    @Getter
    private String newFileFullPath;

    public SetFileRequestDTO(String oldFileFullPath, String newFileFullPath) {
        this.oldFileFullPath = oldFileFullPath;
        this.newFileFullPath = newFileFullPath;
    }

    @JsonIgnore
    public PathDTO getOldFilePath() {
        return PathDTO.fromFullPath(oldFileFullPath);
    }

    @JsonIgnore
    public PathDTO getNewFilePath() {
        if (newFileFullPath == null) {
            return null;
        }
        return PathDTO.fromFullPath(newFileFullPath);
    }
}
