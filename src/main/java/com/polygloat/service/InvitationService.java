package com.polygloat.service;

import com.polygloat.constants.Message;
import com.polygloat.exceptions.BadRequestException;
import com.polygloat.model.Invitation;
import com.polygloat.model.Permission;
import com.polygloat.model.Repository;
import com.polygloat.repository.InvitationRepository;
import com.polygloat.repository.PermissionRepository;
import com.polygloat.security.AuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class InvitationService {
    private final InvitationRepository invitationRepository;
    private final PermissionRepository permissionRepository;
    private final EntityManager entityManager;
    private final AuthenticationFacade authenticationFacade;

    @Transactional
    public String create(Repository repository, Permission.RepositoryPermissionType type) {
        String code = RandomStringUtils.randomAlphabetic(50);
        Invitation invitation = Invitation.builder().code(code).build();
        Permission permission = Permission.builder().invitation(invitation).repository(repository).type(type).build();
        permissionRepository.save(permission);
        invitationRepository.save(invitation);
        return code;
    }

    @Transactional
    public void removeExpired() {
        invitationRepository.deleteAllByCreatedAtLessThan(Date.from(Instant.now().minus(Duration.ofDays(30))));
    }

    @Transactional
    public void accept(String code) {
        Invitation invitation = invitationRepository.findOneByCode(code).orElseThrow(() -> new BadRequestException(Message.INVITATION_CODE_DOES_NOT_EXIST_OR_EXPIRED));

        Permission permission = invitation.getPermission();

        if (!this.permissionRepository.findOneByRepositoryIdAndUserId(permission.getRepository().getId(), authenticationFacade.getUserAccount().getId()).isEmpty()) {
            throw new BadRequestException(Message.USER_ALREADY_HAS_PERMISSIONS);
        }

        permission.setInvitation(null);
        permission.setUser(authenticationFacade.getUserAccount());
        permissionRepository.save(permission);

        //avoid cascade delete
        invitation.setPermission(null);
        invitationRepository.delete(invitation);
    }

    public Optional<Invitation> findById(Long id) {
        return invitationRepository.findById(id);
    }

    public Set<Invitation> getForRepository(Repository repository) {
        return invitationRepository.findAllByPermissionRepositoryOrderByCreatedAt(repository);
    }

    @Transactional
    public void delete(Invitation invitation) {
        invitationRepository.delete(invitation);
    }
}
