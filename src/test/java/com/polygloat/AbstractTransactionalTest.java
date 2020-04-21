package com.polygloat;

import com.polygloat.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.testng.AbstractTransactionalTestNGSpringContextTests;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

@Transactional
public abstract class AbstractTransactionalTest extends AbstractTransactionalTestNGSpringContextTests {
    @Autowired
    protected EntityManager entityManager;

    @Autowired
    protected LanguageRepository languageRepository;

    protected void commitTransaction() {
        TestTransaction.flagForCommit();
        TestTransaction.end();
        //entityManager.clear();
        TestTransaction.start();
    }


    protected void rollbackTransaction() {
        TestTransaction.flagForRollback();
        TestTransaction.end();
        //entityManager.clear();
        TestTransaction.start();
    }

    protected void flush() {
        languageRepository.flush();
        entityManager.flush();
        entityManager.clear();
    }

}
