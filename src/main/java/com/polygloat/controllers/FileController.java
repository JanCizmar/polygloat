package com.polygloat.controllers;

import com.polygloat.dtos.PathDTO;
import com.polygloat.dtos.request.SetFileRequestDTO;
import com.polygloat.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/repository/{repositoryId}/file")
public class FileController implements IController {

    private FileService fileService;

    @Autowired
    FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping(value = "")
    public void setFile(@RequestBody SetFileRequestDTO data,
                        @PathVariable("repositoryId") Long repositoryId) {
        fileService.setFile(repositoryId, data.getOldFilePath(), data.getNewFilePath());
    }

    @DeleteMapping(value = "/{sourcePath}")
    public void deleteFile(@PathVariable("repositoryId") Long repositoryId,
                           @PathVariable("sourcePath") String sourcePath) {
        PathDTO pathDTO = PathDTO.fromFullPath(sourcePath);
        fileService.deleteFile(repositoryId, pathDTO);
    }
}
