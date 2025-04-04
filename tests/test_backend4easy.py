import backend4easy

def test_read_question():
    test_file_path = "./Frontend/public/input.txt"
    with open(test_file_path, 'w', encoding='utf-8') as f:
        f.write("")
    with open(test_file_path, 'w', encoding='utf-8') as f:
        f.write("test123")
    result = backend4easy.read_question()
    assert result == "test123"
    
def test_load_documents_from_directory():
    test_file_path2 = "./test_doc"
    document=backend4easy.load_documents_from_directory(test_file_path2)
    assert document[0]["id"] == "123.txt" and document[0]["text"] == "Hii"

