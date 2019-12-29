package com.polygloat.controllers;

import com.polygloat.DTOs.request.CreateRepositoryDTO;
import com.polygloat.DTOs.request.EditRepositoryDTO;
import com.polygloat.DTOs.response.RepositoryDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.Repository;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.UserAccountRepository;
import com.polygloat.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public/repositories")
public class RepositoryController extends AbstractController {

    private RepositoryService repositoryService;
    private UserAccountRepository userAccountRepository;


    @Autowired
    public RepositoryController(RepositoryService repositoryService, UserAccountRepository userAccountRepository) {
        this.repositoryService = repositoryService;
        this.userAccountRepository = userAccountRepository;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public RepositoryDTO createRepository(@RequestBody @Valid CreateRepositoryDTO dto) {
        //todo: handle user accounts correctly
        UserAccount userAccount = userAccountRepository.findAll().stream().findFirst()
                .orElseThrow(NotFoundException::new);

        Repository repository = repositoryService.createRepository(dto, userAccount);
        return RepositoryDTO.fromEntity(repository);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    public RepositoryDTO editRepository(@RequestBody @Valid EditRepositoryDTO dto) {
        Repository repository = repositoryService.editRepository(dto);
        return RepositoryDTO.fromEntity(repository);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public Set<RepositoryDTO> getAll() {
        //todo: handle user accounts correctly
        UserAccount userAccount = userAccountRepository.findAll().stream().findFirst()
                .orElseThrow(NotFoundException::new);

        return repositoryService.findAll().stream().map(RepositoryDTO::fromEntity)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void deleteRepository(@PathVariable Long id) {
        repositoryService.deleteRepository(id);
    }

}
