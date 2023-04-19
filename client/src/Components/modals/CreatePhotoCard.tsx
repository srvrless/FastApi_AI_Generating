import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import { Context } from "../../index";
import { createPhotoCard, fetchAuthors, fetchPhotoCards, fetchTypes } from "../../http/photoCardAPI";
import { observer } from "mobx-react-lite";

interface CreateTypeProps {
    show: boolean;
    onHide: () => void;
}
type InfoItem = {
    title: string;
    description: string;
    number: number;
};
const CreatePhotoCard = observer(({ show, onHide }: CreateTypeProps) => {
    const { gallery } = useContext(Context)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [info, setInfo] = useState<InfoItem[]>([{ title: '', description: '', number: Date.now() }]);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchTypes().then((data: any) => gallery.setTypes(data))
        fetchAuthors().then((data: any) => gallery.setAuthors(data))
    }, [])


    const addInfo = () => {
        setInfo([...info, { title: '', description: '', number: Date.now() }])
    }
    const removeInfo = (number: any) => {
        setInfo(info.filter(i => i.number !== number))
    }
    const changeInfo = (key: string, value: string, number: any) => {
        setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i))
    }

    const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }
    const addgallery = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('img', file);
        formData.append('AuthorId', gallery.selectedBrand.id);
        formData.append('typeId', gallery.selectedType.id);
        formData.append('info', JSON.stringify(info));

        try {
            const data = await createPhotoCard(formData);
            onHide();
        } catch (error) {
            console.error('Error creating photo card:', error);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить устройство
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{gallery.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {gallery.types.map((type: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) =>
                                <Dropdown.Item
                                    onClick={() => gallery.setSelectedType(type)}
                                    key={type.id}
                                >
                                    {type.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{gallery.setAuthors.name || "Выберите тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {gallery.authors.map((Author: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) =>


                                <Dropdown.Item
                                    key={Author.id}
                                    onClick={() => gallery.setAuthors(Author)}
                                >
                                    {Author.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название устройства"
                    />
                    <Form.Control
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость устройства"
                        type="number"
                    />
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    />
                    <hr />
                    <Button
                        variant={"outline-dark"}
                        onClick={addInfo}
                    >
                        Добавить новое свойство
                    </Button>
                    {info.map(i =>
                        <Row className="mt-4" key={i.number}>
                            <Col md={4}>
                                <Form.Control
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                    placeholder="Введите название свойства"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    value={i.description}
                                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                    placeholder="Введите описание свойства"
                                />
                            </Col>
                            <Col md={4}>
                                <Button
                                    onClick={() => removeInfo(i.number)}
                                    variant={"outline-danger"}
                                >
                                    Удалить
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addgallery}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreatePhotoCard;
