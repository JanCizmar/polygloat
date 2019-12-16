package com.polygloat.DTOs;

public class SetFolderRequestDTO {
    private FolderDTO oldFolder;
    private FolderDTO newFolder;

    public FolderDTO getOldFolder() {
        return oldFolder;
    }

    public FolderDTO getNewFolder() {
        return newFolder;
    }
}
