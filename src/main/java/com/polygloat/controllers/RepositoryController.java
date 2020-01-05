package com.polygloat.controllers;

import com.polygloat.dtos.request.CreateRepositoryDTO;
import com.polygloat.dtos.request.EditRepositoryDTO;
import com.polygloat.dtos.response.RepositoryDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Repository;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.UserAccountRepository;
import com.polygloat.security.AuthenticationFacade;
import com.polygloat.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController("_repositoryController")
@CrossOrigin(origins = "*")
@RequestMapping("/api/repositories")

public class RepositoryController implements IController {

    private RepositoryService repositoryService;
    private UserAccountRepository userAccountRepository;
    private AuthenticationFacade authenticationFacade;

    @Autowired
    public RepositoryController(RepositoryService repositoryService, UserAccountRepository userAccountRepository, AuthenticationFacade authenticationFacade) {
        this.repositoryService = repositoryService;
        this.userAccountRepository = userAccountRepository;
        this.authenticationFacade = authenticationFacade;
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
        return repositoryService.findAll(authenticationFacade.getUserAccount()).stream().map(RepositoryDTO::fromEntity)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void deleteRepository(@PathVariable Long id) {
        repositoryService.deleteRepository(id);
    }

}
