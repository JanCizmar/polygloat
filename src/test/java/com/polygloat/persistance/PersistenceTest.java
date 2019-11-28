package com.polygloat.persistance;

import com.polygloat.development.DbPopulatorReal;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.UserRepository;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PersistenceTest {

    @Autowired
    DbPopulatorReal populator;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RepositoryRepository repositoryRepository;

    @Autowired
    PlatformTransactionManager transactionManager;

    @Autowired
    EntityManager entityManager;

    @Test
    @Transactional
    void testPopulator() {
        populator.populate();

        List<UserAccount> all = userRepository.findAll();

        assertThat(all.size()).isGreaterThan(0);

        entityManager.refresh(all.get(0));

        Hibernate.initialize(all.get(0).getCreatedRepositories());

        assertThat(all.get(0).getCreatedRepositories().size()).isGreaterThan(0);
    }

}
