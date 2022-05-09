const notes = require("./notes");
const {nanoid} = require('nanoid');

const addNoteHandler = (request,h) => {

    // Deklarasi Objek
    const{title, tags, body} = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Function method push
    const newNote = {
        title,tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id ).length > 0;

    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data:{
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status:'fail',
        message: 'Catatan Gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    // Langsung Kasih Response
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request,h) => {
    const {id} = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if(note !== undefined){
        return{
            status:'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request,h) => {
    // Permintaan Data yang ingin diedit dari server
    const {id} = request.params;
    const {title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    // Menemukan ID data yang ingin diubah
    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        }

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
        });
    
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbaharui data. Id tidak ditemukan'
    });
    response.code(404);
    return response;

};

const deleteNoteByIdHandler = (request,h) => {
    // request id
    const {id} = request.params;

    // Menemukan ID data yang ingin diubah
    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1){
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Data berhasil dihapus'
        });
        
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Data gagal dihapus, id tidak ditemukan'
    });
    response.code(404);
    return response;
}
module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler}