describe('core.service.FileUploaderService', function() {
    var service,
        attachmentMetadataRepository,
        fileLibrary,
        file,
        fileOperator,
        folderOperator,
        storage,
        backend,
        fileId = 123,
        fileUuid = '0204795a-0675-44b6-9460-ba935dcdbdf7',
        filename = 'foo.jpg',
        fileCreated = new Date(),
        mimetype = 'image/jpeg';

    beforeEach(inject(function ($injector) {
        attachmentMetadataRepository = $injector.get('AttachmentMetadataRepository');
        fileLibrary = $injector.get('FileLibrary');

        service = new FileUploaderService(
            attachmentMetadataRepository,
            fileLibrary
        );

        fileOperator = jasmine.createSpyObj('FileOperator', ['update']);
        folderOperator = jasmine.createSpyObj('FolderOperator', ['createByUrl']);
        storage = jasmine.createSpyObj('FilesystemStorage', ['retrieve']);
        backend = jasmine.createSpyObj('FileBackend', ['findByFinder']);

        spyOn(fileLibrary, 'getFileOperator').and.returnValue(fileOperator);
        spyOn(fileLibrary, 'getFolderOperator').and.returnValue(folderOperator);
        spyOn(fileLibrary, 'getStorage').and.returnValue(storage);
        spyOn(fileLibrary, 'getBackend').and.returnValue(backend);

        file = jasmine.createSpyObj('File', ['getId', 'getName', 'getUuid', 'getDateCreated', 'getMimetype', 'getResource']);
        file.getId.and.returnValue(fileId);
        file.getName.and.returnValue(filename);
        file.getUuid.and.returnValue(fileUuid);
        file.getDateCreated.and.returnValue(fileCreated);
        file.getMimetype.and.returnValue(mimetype);
    }));

    it('should find file by UUID', function() {
       var results = [file];
       backend.findByFinder
           .and.returnValue(results);

       expect(service.getFileByUuid(fileUuid)).toEqual(file);
       expect(backend.findByFinder).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it('should upload file with title', function () {
        var path = '/path/to/file';
        var title = 'attachment-title';

        var uploadedFile = new UploadedFile(path, filename, title);

        var resource = jasmine.createSpyObj('Resource', ['setExclusive']);
        file.getResource.and.returnValue(resource);

        spyOn(attachmentMetadataRepository, 'save');

        var folder = new Folder();
        folderOperator.createByUrl.and.returnValue(folder);

        spyOn(fileLibrary, 'upload').and.callFake(function(fileUpload) {
            expect(fileUpload.getOverrideFilename()).toEqual(filename);
            expect(fileUpload.getRealPath()).toEqual(path);

            return file;
        });

        service.upload(uploadedFile, path, title);

        expect(resource.setExclusive).toHaveBeenCalledWith(true);
        expect(fileOperator.update).toHaveBeenCalledWith(file);
        expect(folderOperator.createByUrl).toHaveBeenCalledWith(path);

        expect(attachmentMetadataRepository.save)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                metadata: {
                    title: title
                }
            }));

        expect(fileLibrary.upload).toHaveBeenCalledWith(jasmine.any(Object), folder);
    });

});
