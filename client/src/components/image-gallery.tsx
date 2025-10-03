import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Images, ChevronLeft, ChevronRight, Download, Share, Eye, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageGeneration } from "@shared/schema";

interface ImageGalleryProps {
  images: ImageGeneration[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  const completedImages = images.filter(img => img.status === "completed" && img.imageUrl);
  const imagesPerPage = 5;
  const totalPages = Math.ceil(completedImages.length / imagesPerPage);
  
  const selectedImage = completedImages[selectedImageIndex];

  useEffect(() => {
    // Reset selected image when images change
    if (completedImages.length > 0 && selectedImageIndex >= completedImages.length) {
      setSelectedImageIndex(0);
    }
  }, [completedImages.length, selectedImageIndex]);

  const handleDownload = async (image: ImageGeneration) => {
    if (!image.id) return;

    try {
      const response = await fetch(`/api/images/${image.id}/download`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${image.title || 'generated-image'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleShare = async (image: ImageGeneration) => {
    if (!image.imageUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title || 'AI Generated Image',
          text: 'Check out this AI-generated image from SonicVision Studio',
          url: image.imageUrl,
        });
      } catch (error) {
        console.error("Share error:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(image.imageUrl);
        // Could show a toast here
      } catch (error) {
        console.error("Copy error:", error);
      }
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (completedImages.length === 0) {
    return (
      <Card className={cn("", className)} data-testid="image-gallery-empty">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Images className="w-5 h-5 text-accent" />
              AI Visual Gallery
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Images className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">No Images Generated</h3>
              <p className="text-sm text-muted-foreground">Generate music to create paired visuals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)} data-testid="image-gallery">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Images className="w-5 h-5 text-accent" />
            AI Visual Gallery
          </h2>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            View All
          </button>
        </div>

        {/* Main Image Display */}
        {selectedImage && (
          <div className="relative rounded-xl overflow-hidden aspect-video bg-secondary group">
            <img 
              src={selectedImage.imageUrl!} 
              alt={selectedImage.title || "AI generated visual art"} 
              className="w-full h-full object-cover"
              data-testid="main-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1" data-testid="image-title">
                    {selectedImage.title || "Generated Image"}
                  </h3>
                  <p className="text-sm text-muted-foreground">Generated with DALL-E 3</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(selectedImage)}
                    size="icon"
                    className="w-10 h-10 rounded-lg bg-secondary/80 backdrop-blur hover:bg-muted transition-colors"
                    data-testid="button-download-image"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleShare(selectedImage)}
                    size="icon"
                    className="w-10 h-10 rounded-lg bg-secondary/80 backdrop-blur hover:bg-muted transition-colors"
                    data-testid="button-share-image"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Carousel */}
        <div className="relative">
          <div className="flex gap-3 overflow-hidden">
            {completedImages
              .slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage)
              .map((image, index) => {
                const globalIndex = currentPage * imagesPerPage + index;
                return (
                  <div
                    key={image.id}
                    className={cn(
                      "flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden cursor-pointer transition-all",
                      selectedImageIndex === globalIndex 
                        ? "ring-2 ring-primary" 
                        : "hover:ring-2 ring-primary/50"
                    )}
                    onClick={() => setSelectedImageIndex(globalIndex)}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img 
                      src={image.imageUrl!} 
                      alt={image.title || `Gallery thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Carousel Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={prevPage}
              size="icon"
              variant="outline"
              className="w-8 h-8 rounded-full"
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentPage ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <Button
              onClick={nextPage}
              size="icon"
              variant="outline"
              className="w-8 h-8 rounded-full"
              data-testid="button-carousel-next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
