package com.polygloat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.transaction.TestTransaction;

import javax.persistence.EntityManager;


public abstract class AbstractTransactionalTest {
    @Autowired
    protected EntityManager entityManager;

    protected void newTransaction() {
        TestTransaction.flagForCommit();
        TestTransaction.end();
        //entityManager.clear();
        TestTransaction.start();
    }
}
