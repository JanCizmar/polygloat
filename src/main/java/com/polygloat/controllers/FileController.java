package com.polygloat.controllers;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.request.SetFileRequestDTO;
import com.polygloat.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public/repository/{repositoryId}/file")
public class FileController extends AbstractController {

    private FileService fileService;

    @Autowired
    FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public void setFile(@RequestBody SetFileRequestDTO data,
                        @PathVariable("repositoryId") Long repositoryId) {
        fileService.setFile(repositoryId, data.getOldFilePath(), data.getNewFilePath());
    }

    //todo rename to delete file
    @RequestMapping(value = "/{sourcePath}", method = RequestMethod.DELETE)
    public void deleteFile(@PathVariable("repositoryId") Long repositoryId,
                           @PathVariable("sourcePath") String sourcePath) {
        PathDTO pathDTO = PathDTO.fromFullPath(sourcePath);
        fileService.deleteFile(repositoryId, pathDTO);
    }
}
