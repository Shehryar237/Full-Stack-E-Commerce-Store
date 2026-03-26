import { useState, useEffect } from 'react';
import {
    Modal,
    TextInput,
    Textarea,
    NumberInput,
    Group,
    Button,
} from '@mantine/core';

export interface ProductData {
    title: string;
    description: string;
    price: number;
    stock: number;
}

interface Props {
    opened: boolean;
    title: string;
    initialData?: ProductData;
    id?: string;
    onClose: () => void;
    onSubmit: (
        id: string | undefined,
        data: ProductData,
        imageFile?: File | null
    ) => Promise<void> | void;
}

export default function ProductModal({
    opened,
    title: modalTitle,
    initialData,
    onClose,
    onSubmit,
    id,
}: Props) {
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [price, setPrice] = useState<number | undefined>(initialData?.price);
    const [stock, setStock] = useState<number>(initialData?.stock ?? 0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // reset when modal opens
    useEffect(() => {
        if (opened) {
            setTitle(initialData?.title ?? '');
            setDescription(initialData?.description ?? '');
            setPrice(initialData?.price);
            setStock(initialData?.stock ?? 0);
                if (initialData) {
                    // already exists then clear it
                    setPreviewUrl(null);
                    setImageFile(null);
                }
        }
    }, [opened, initialData]);

    useEffect(() => {
        if (!imageFile) return;
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        console.log("Picked file:", file);
        setImageFile(file);
    };

    const handleSubmit = async () => {
        if (!title || !description || price == null || stock == null) return;
        console.log("Submitting from modal:", { id, title, description, price, stock, imageFile });

        await onSubmit(
            id,
            { title, description, price, stock },
            imageFile                               
        );
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={modalTitle}
            centered
            size="xl"
            closeOnClickOutside={false}
        >
            <div style={{ marginTop: 12 }}>
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewUrl && (
                    <div style={{ marginTop: 8 }}>
                        <img
                            src={previewUrl}
                            alt="preview"
                            style={{
                                maxWidth: 200,
                                maxHeight: 150,
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                )}
            </div>
            <TextInput
                label="Title"
                placeholder="Product title"
                required
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
            />

            <Textarea
                label="Description"
                placeholder="Product description"
                minRows={5}
                maxRows={10}
                mt="md"
                required
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
            />

            <NumberInput
                label="Price"
                placeholder="0.00"
                required
                min={0}
                mt="md"
                value={price}
                onChange={(v) => setPrice(v as number)}
            />
            <NumberInput
                label="Stock"
                placeholder="0"
                required
                min={0}
                mt="md"
                value={stock}
                onChange={(v) => setStock(v as number)}
            />

            <Group>
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>{modalTitle}</Button>
            </Group>
        </Modal>
    );
}
