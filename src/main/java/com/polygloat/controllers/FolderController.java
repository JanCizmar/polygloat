package com.polygloat.controllers;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.SetFolderRequestDTO;
import com.polygloat.service.FileService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public/repository/{repositoryId}/folders")
public class FolderController {

    private FileService fileService;

    FolderController(FileService fileService) {
        this.fileService = fileService;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public void setFolder(@RequestBody SetFolderRequestDTO data,
                          @PathVariable("repositoryId") Long repositoryId) {
        fileService.setFolder(repositoryId, data.getOldFolder(), data.getNewFolder());
    }

    @RequestMapping(value = "/{fullPath}", method = RequestMethod.DELETE)
    public void deleteTranslation(@PathVariable("repositoryId") Long repositoryId,
                                  @PathVariable("fullPath") String fullPath) {

        fileService.deleteFolder(repositoryId, PathDTO.fromFullPath(fullPath));
    }
}
