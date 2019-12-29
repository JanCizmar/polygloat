package com.polygloat.model.hooks;

import com.polygloat.model.File;
import com.polygloat.service.FileService;
import org.springframework.stereotype.Component;

import javax.persistence.PostLoad;
import javax.persistence.PrePersist;

@Component
public class FileHooks {

    private static FileService fileService;

    @PrePersist
    public void updateChildrenMaterializedPaths(File f) {
        if (f.getOldName() != null && f.getName() != null && f.getOldName().equals(f.getName())) {
            fileService.updateChildMaterializedPaths(f);
        }
    }

    @PostLoad
    public void postLoad(File f) {
        f.setOldName(f.getName());
        f.setOldMaterializedPath(f.getMaterializedPath());
    }
}
