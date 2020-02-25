package com.polygloat.controllers;

import com.polygloat.dtos.request.DeleteSourceDTO;
import com.polygloat.dtos.request.EditSourceDTO;
import com.polygloat.dtos.request.SetTranslationsDTO;
import com.polygloat.dtos.response.SourceDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Permission;
import com.polygloat.model.Source;
import com.polygloat.service.RepositoryService;
import com.polygloat.service.SecurityService;
import com.polygloat.service.SourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/repository/{repositoryId}/sources")
public class SourceController implements IController {

    private final SourceService sourceService;
    private final SecurityService securityService;

    /*@PostMapping(value = "")
    public void create(@PathVariable("repositoryId") Long repositoryId,
                       @RequestBody @Valid SourceDTO dto) {
        Repository repository = repositoryService.findById(repositoryId).orElseThrow(NotFoundException::new);

        sourceService.createSource(repository, dto);
    }*/


    @PostMapping("/create")
    private void create(@PathVariable("repositoryId") Long repositoryId, @RequestBody SetTranslationsDTO dto) {
        Permission permission = securityService.checkRepositoryPermission(repositoryId, Permission.RepositoryPermissionType.TRANSLATE);
        sourceService.createSource(permission.getRepository(), dto);
    }

    @PostMapping(value = "/edit")
    public void edit(@PathVariable("repositoryId") Long repositoryId, @RequestBody @Valid EditSourceDTO dto) {
        Permission permission = securityService.checkRepositoryPermission(repositoryId, Permission.RepositoryPermissionType.EDIT);
        sourceService.editSource(permission.getRepository(), dto);
    }

    @GetMapping(value = "{id}")
    public SourceDTO get(@PathVariable("id") Long id) {
        Source source = sourceService.getSource(id).orElseThrow(NotFoundException::new);
        securityService.getAnyRepositoryPermission(source.getRepository().getId());
        return SourceDTO.builder().fullPathString(source.getName()).build();
    }

    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable Long id) {
        Source source = sourceService.getSource(id).orElseThrow(NotFoundException::new);
        securityService.checkRepositoryPermission(source.getRepository().getId(), Permission.RepositoryPermissionType.EDIT);
        sourceService.deleteSource(id);
    }

    @DeleteMapping(value = "")
    public void delete(@PathVariable("repositoryId") Long repositoryId, @RequestBody DeleteSourceDTO dto) {
        Source source = sourceService.getSource(repositoryId, dto.getFullPathDTO()).orElseThrow(NotFoundException::new);
        securityService.checkRepositoryPermission(source.getRepository().getId(), Permission.RepositoryPermissionType.EDIT);
        sourceService.deleteSource(source.getId());
    }
}
