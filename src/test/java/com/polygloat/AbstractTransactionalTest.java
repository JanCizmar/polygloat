package com.polygloat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.transaction.TestTransaction;

import javax.persistence.EntityManager;


public abstract class AbstractTransactionalTest {
    @Autowired
    protected EntityManager entityManager;

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
}
