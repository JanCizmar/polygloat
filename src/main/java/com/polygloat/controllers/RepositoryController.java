package com.polygloat.controllers;

import com.polygloat.dtos.request.CreateRepositoryDTO;
import com.polygloat.dtos.request.EditRepositoryDTO;
import com.polygloat.dtos.request.InviteUser;
import com.polygloat.dtos.response.RepositoryDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Repository;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.UserAccountRepository;
import com.polygloat.security.AuthenticationFacade;
import com.polygloat.service.InvitationService;
import com.polygloat.service.RepositoryService;
import com.polygloat.service.SecurityService;
import com.polygloat.service.UserAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController("_repositoryController")
@CrossOrigin(origins = "*")
@RequestMapping("/api/repositories")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class RepositoryController implements IController {

    private final RepositoryService repositoryService;
    private final UserAccountRepository userAccountRepository;
    private final AuthenticationFacade authenticationFacade;
    private final SecurityService securityService;
    private final UserAccountService userAccountService;
    private final InvitationService invitationService;


    @PostMapping(value = "")
    public RepositoryDTO createRepository(@RequestBody @Valid CreateRepositoryDTO dto) {
        UserAccount userAccount = authenticationFacade.getUserAccount();
        Repository repository = repositoryService.createRepository(dto, userAccount);
        return RepositoryDTO.fromEntity(repository);
    }

    @PostMapping(value = "/edit")
    public RepositoryDTO editRepository(@RequestBody @Valid EditRepositoryDTO dto) {

        //todo: handle permissions
        //securityService.canEditRepository(dto.getRepositoryId());

        Repository repository = repositoryService.editRepository(dto);
        return RepositoryDTO.fromEntity(repository);
    }

    @GetMapping(value = "")
    public Set<RepositoryDTO> getAll() {
        return repositoryService.findAllPermitted(authenticationFacade.getUserAccount()).stream().map(RepositoryDTO::fromEntity)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @DeleteMapping(value = "/{id}")
    public void deleteRepository(@PathVariable Long id) {
        repositoryService.deleteRepository(id);
    }

    @PostMapping("/invite")
    public String inviteUser(@RequestBody InviteUser invitation) {
        securityService.checkManageRepositoryPermission(invitation.getRepositoryId());
        Repository repository = repositoryService.findById(invitation.getRepositoryId()).orElseThrow(NotFoundException::new);
        return invitationService.create(repository, invitation.getType());
    }
}
