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

        Repository repository = new Repository();
        repository.setName("Application");
        repository.setCreatedBy(userAccount);
        repositoryRepository.save(repository);

        Language en = createLanguage("en", repository);
        Language de = createLanguage("de", repository);

        createTranslation(repository, null, "Hello world!", "Hallo Welt!", en, de);
        createTranslation(repository, null, "English text one.", "Deutsch text einz.", en, de);
        entityManager.flush();

        Folder home = createFolder(repository, null, "home");
        createTranslation(repository, home, "This is translation in home folder",
                "Dies ist die Übersetzung im Home-Ordner", en, de);

        Folder news = createFolder(repository, home, "news");
        createTranslation(repository, news, "This is translation in news folder",
                "Dies ist die Übersetzung im News-Ordner", en, de);
        createTranslation(repository, news, "This is another translation in news folder",
                "Dies ist eine weitere Übersetzung im Nachrichtenordner", en, de);

        Folder sampleApp = createFolder(repository, null, "sampleApp");
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

    private void createTranslation(Repository repository, Folder folder, String english, String deutsch, Language en, Language de) {
        Source source = new Source();
        source.setFolder(folder);
        source.setRepository(repository);
        source.setText(english.replaceAll("[^\\w\\d]", "_")
                .replaceAll("^_*(.*?)_*$", "$1"));
        entityManager.persist(source);

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

    private Folder createFolder(Repository repository, Folder parent, String name) {
        Folder folder = new Folder();
        folder.setName(name);
        folder.setRepository(repository);
        folder.setParent(parent);
        entityManager.persist(folder);
        return folder;
    }


}
