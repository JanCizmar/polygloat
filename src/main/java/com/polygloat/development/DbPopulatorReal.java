package com.polygloat.development;

import com.polygloat.model.*;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

@Component
public class DbPopulatorReal {
    private EntityManager entityManager;

    private UserRepository userRepository;

    private RepositoryRepository repositoryRepository;

    @Autowired
    public DbPopulatorReal(EntityManager entityManager, UserRepository userRepository, RepositoryRepository repositoryRepository) {
        this.entityManager = entityManager;
        this.userRepository = userRepository;
        this.repositoryRepository = repositoryRepository;
    }

    @Transactional
    public void populate() {
        //do not populate if db is not empty
        if (userRepository.count() > 0) {
            return;
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setUsername("user");
        userRepository.save(userAccount);


        File root = createFolder(null, null);

        Repository repository = new Repository();
        repository.setName("Application");
        repository.setCreatedBy(userAccount);
        repository.setRootFolder(root);
        repositoryRepository.save(repository);

        Language en = createLanguage("en", repository);
        Language de = createLanguage("de", repository);

        createTranslation(repository, root, "Hello world!", "Hallo Welt!", en, de);
        createTranslation(repository, root, "English text one.", "Deutsch text einz.", en, de);
        entityManager.flush();

        File home = createFolder(root, "home");
        createTranslation(repository, home, "This is translation in home folder",
                "Dies ist die Übersetzung im Home-Ordner", en, de);

        File news = createFolder(home, "news");
        createTranslation(repository, news, "This is translation in news folder",
                "Dies ist die Übersetzung im News-Ordner", en, de);
        createTranslation(repository, news, "This is another translation in news folder",
                "Dies ist eine weitere Übersetzung im Nachrichtenordner", en, de);

        File sampleApp = createFolder(root, "sampleApp");
        createTranslation(repository, sampleApp, "This is standard text somewhere in DOM.",
                "Dies ist Standardtext irgendwo im DOM.", en, de);
        createTranslation(repository, sampleApp, "This is another standard text somewhere in DOM.",
                "Dies ist ein weiterer Standardtext irgendwo in DOM.", en, de);
        createTranslation(repository, sampleApp, "This is translation retrieved by service.",
                "Diese Übersetzung wird vom Service abgerufen.", en, de);
        createTranslation(repository, sampleApp, "This is textarea with placeholder and value.",
                "Dies ist ein Textarea mit Placeholder und Value.", en, de);
        createTranslation(repository, sampleApp, "This is textarea with placeholder.",
                "Dies ist ein Textarea mit Placeholder.", en, de);
        createTranslation(repository, sampleApp, "This is input with value.",
                "Dies ist ein Input mit value.", en, de);
        createTranslation(repository, sampleApp, "This is input with placeholder.",
                "Dies ist ein Input mit Placeholder.", en, de);
    }


    private Language createLanguage(String name, Repository repository) {
        Language language = new Language();
        language.setAbbreviation(name);
        language.setRepository(repository);
        language.setName(name);
        entityManager.persist(language);
        return language;
    }

    private void createTranslation(Repository repository, File parent, String english,
                                   String deutsch, Language en, Language de) {


        File file = new File();
        file.setParent(parent);
        file.setName(english.replaceAll("[^\\w\\d]", "_")
                .replaceAll("^_*(.*?)_*$", "$1"));

        Source source = new Source();
        file.setSource(source);
        file.setRepository(repository);

        entityManager.persist(source);
        entityManager.persist(file);


        Translation translation = new Translation();
        translation.setLanguage(en);
        translation.setSource(source);
        translation.setText(english);

        entityManager.persist(translation);

        Translation translationDe = new Translation();
        translationDe.setLanguage(de);
        translationDe.setSource(source);
        translationDe.setText(deutsch);

        entityManager.persist(translationDe);
    }

    private File createFolder(File parent, String name) {
        File folder = new File();
        folder.setName(name);
        folder.setParent(parent);
        entityManager.persist(folder);
        return folder;
    }


}
