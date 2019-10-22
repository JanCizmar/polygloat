package com.polygloat.persistance;

import com.polygloat.Application;
import com.polygloat.model.Language;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Application.class, H2JpaConfig.class})
public class PersistanceTest {

    @Test
    public void testInsert(){
        Language language = new Language();
        language.setName("Helloou");
    }

}
