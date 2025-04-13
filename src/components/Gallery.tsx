import React, { useState, useEffect } from 'react';
import { Card, Upload, Modal, Button, Input, message, Image } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAuth } from '../contexts/AuthContext';

interface MediaItem {
    media_id: number;
    media_type: 'photo' | 'video';
    file_path: string;
    upload_date: string;
    uploaded_by_name: string;
    description: string;
}

interface Gallery {
    gallery_id: number;
    title: string;
    event_name: string;
    created_at: string;
    created_by_name: string;
}

const GalleryComponent: React.FC = () => {
    const { user } = useAuth();
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [selectedGallery, setSelectedGallery] = useState<number | null>(null);
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});

    const canUpload = user.role === 'mentor' || user.role === 'gen_sec';

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            const response = await fetch('/api/gallery', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setGalleries(data);
        } catch (error) {
            message.error('Failed to fetch galleries');
        }
    };

    const fetchGalleryMedia = async (galleryId: number) => {
        try {
            const response = await fetch(`/api/gallery/${galleryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setMediaList(data.media);
            setSelectedGallery(galleryId);
        } catch (error) {
            message.error('Failed to fetch gallery media');
        }
    };

    const handleUpload = async () => {
        if (!selectedGallery) return;

        const formData = new FormData();
        fileList.forEach((file, index) => {
            formData.append('media', file.originFileObj as File);
            formData.append(`descriptions[${index}]`, descriptions[file.uid] || '');
        });

        try {
            await fetch(`/api/gallery/upload/${selectedGallery}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            message.success('Media uploaded successfully');
            setIsUploadModalVisible(false);
            setFileList([]);
            setDescriptions({});
            fetchGalleryMedia(selectedGallery);
        } catch (error) {
            message.error('Failed to upload media');
        }
    };

    const renderMedia = (item: MediaItem) => {
        if (item.media_type === 'photo') {
            return (
                <Image
                    src={`/uploads/${item.file_path}`}
                    alt="Gallery item"
                    className="w-full h-48 object-cover"
                />
            );
        } else {
            return (
                <video
                    src={`/uploads/${item.file_path}`}
                    controls
                    className="w-full h-48"
                />
            );
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gallery</h1>

            {canUpload && selectedGallery && (
                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => setIsUploadModalVisible(true)}
                    className="mb-6"
                >
                    Upload Media
                </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mediaList.map(item => (
                    <Card
                        key={item.media_id}
                        cover={renderMedia(item)}
                        className="shadow-lg"
                    >
                        <Card.Meta
                            title={item.description}
                            description={
                                <div>
                                    <p>Uploaded by: {item.uploaded_by_name}</p>
                                    <p>Date: {new Date(item.upload_date).toLocaleString()}</p>
                                </div>
                            }
                        />
                    </Card>
                ))}
            </div>

            <Modal
                title="Upload Media"
                open={isUploadModalVisible}
                onOk={handleUpload}
                onCancel={() => {
                    setIsUploadModalVisible(false);
                    setFileList([]);
                    setDescriptions({});
                }}
            >
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    beforeUpload={() => false}
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
                {fileList.map(file => (
                    <div key={file.uid} className="mb-4">
                        <p>{file.name}</p>
                        <Input
                            placeholder="Add description"
                            value={descriptions[file.uid] || ''}
                            onChange={e => setDescriptions({
                                ...descriptions,
                                [file.uid]: e.target.value
                            })}
                        />
                    </div>
                ))}
            </Modal>

            {/* Gallery Selection */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Select Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {galleries.map(gallery => (
                        <Card
                            key={gallery.gallery_id}
                            className={`cursor-pointer ${selectedGallery === gallery.gallery_id ? 'border-blue-500' : ''}`}
                            onClick={() => fetchGalleryMedia(gallery.gallery_id)}
                        >
                            <Card.Meta
                                title={gallery.title}
                                description={
                                    <div>
                                        <p>Event: {gallery.event_name}</p>
                                        <p>Created by: {gallery.created_by_name}</p>
                                        <p>Created: {new Date(gallery.created_at).toLocaleString()}</p>
                                    </div>
                                }
                            />
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryComponent; 