import type { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import fs from 'fs';
import path from 'path';

export const getGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
};

export const uploadGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }

    const { name, school, className } = req.body;
    if (!name || !school || !className) {
      res.status(400).json({ error: 'Name, school, and className are required' });
      return;
    }

    // Ensure uploads/gallery directory exists
    const galleryDir = path.join(process.cwd(), 'uploads', 'gallery');
    if (!fs.existsSync(galleryDir)) {
      fs.mkdirSync(galleryDir, { recursive: true });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname) || '.jpg'}`;
    const filePath = path.join(galleryDir, filename);

    // Save file buffer to local disk
    fs.writeFileSync(filePath, req.file.buffer);

    const imageUrl = `/uploads/gallery/${filename}`;

    const newImage = await prisma.galleryImage.create({
      data: {
        image: imageUrl,
        name,
        school,
        className
      }
    });

    res.status(201).json({ message: 'Gallery image uploaded successfully', data: newImage });
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    res.status(500).json({ error: 'Failed to upload gallery image' });
  }
};

export const deleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const image = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id as string) }
    });

    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { id: parseInt(id as string) }
    });

    // Delete physical file
    // image.image is something like "/uploads/gallery/1724083320293.jpg"
    const filePath = path.join(process.cwd(), image.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
};
