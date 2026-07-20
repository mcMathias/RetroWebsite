"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createProductAction, updateProductAction } from "@/features/products/actions";
import { type ProductWithImages } from "@/features/products/repository";
import { type CreateProductInput } from "@/lib/validation/product";

interface ProductFormProps {
  product?: ProductWithImages;
  mode: "create" | "edit";
}

const platforms = [
  { group: "Nintendo", items: [
    { value: "NES", label: "NES" },
    { value: "SNES", label: "SNES" },
    { value: "N64", label: "Nintendo 64" },
    { value: "GAMECUBE", label: "GameCube" },
    { value: "WII", label: "Wii" },
    { value: "WII_U", label: "Wii U" },
    { value: "SWITCH", label: "Switch" },
    { value: "GAME_BOY", label: "Game Boy" },
    { value: "GAME_BOY_COLOR", label: "Game Boy Color" },
    { value: "GAME_BOY_ADVANCE", label: "Game Boy Advance" },
    { value: "NINTENDO_DS", label: "Nintendo DS" },
    { value: "NINTENDO_3DS", label: "Nintendo 3DS" },
  ]},
  { group: "PlayStation", items: [
    { value: "PS1", label: "PlayStation 1" },
    { value: "PS2", label: "PlayStation 2" },
    { value: "PS3", label: "PlayStation 3" },
    { value: "PS4", label: "PlayStation 4" },
    { value: "PS5", label: "PlayStation 5" },
    { value: "PSP", label: "PSP" },
    { value: "PS_VITA", label: "PS Vita" },
  ]},
  { group: "Xbox", items: [
    { value: "XBOX", label: "Xbox" },
    { value: "XBOX_360", label: "Xbox 360" },
    { value: "XBOX_ONE", label: "Xbox One" },
    { value: "XBOX_SERIES", label: "Xbox Series X|S" },
  ]},
  { group: "Sega", items: [
    { value: "MASTER_SYSTEM", label: "Master System" },
    { value: "MEGA_DRIVE", label: "Mega Drive" },
    { value: "SATURN", label: "Saturn" },
    { value: "DREAMCAST", label: "Dreamcast" },
    { value: "GAME_GEAR", label: "Game Gear" },
  ]},
];

const conditions = [
  { value: "MINT", label: "Mint" },
  { value: "NEAR_MINT", label: "Near Mint" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "ACCEPTABLE", label: "Acceptable" },
  { value: "POOR", label: "Poor" },
  { value: "FOR_PARTS", label: "For Parts" },
];

const regions = [
  { value: "PAL", label: "PAL (Europe)" },
  { value: "NTSC_U", label: "NTSC-U (America)" },
  { value: "NTSC_J", label: "NTSC-J (Japan)" },
  { value: "REGION_FREE", label: "Region Free" },
];

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form state
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [platform, setPlatform] = useState(product?.platform ?? "");
  const [condition, setCondition] = useState(product?.condition ?? "");
  const [region, setRegion] = useState(product?.region ?? "PAL");
  const [priceInOre, setPriceInOre] = useState(
    product ? String(product.priceInOre / 100) : "",
  );
  const [salePriceInOre, setSalePriceInOre] = useState(
    product?.salePriceInOre ? String(product.salePriceInOre / 100) : "",
  );
  const [costPriceInOre, setCostPriceInOre] = useState(
    product?.costPriceInOre ? String(product.costPriceInOre / 100) : "",
  );
  const [quantity, setQuantity] = useState(String(product?.quantity ?? "0"));
  const [weight, setWeight] = useState(
    product?.weight ? String(product.weight) : "",
  );
  const [barcode, setBarcode] = useState(product?.barcode ?? "");
  const [serialNumber, setSerialNumber] = useState(product?.serialNumber ?? "");
  const [videoUrl, setVideoUrl] = useState(product?.videoUrl ?? "");
  const [testReport, setTestReport] = useState(product?.testReport ?? "");
  const [cleaningReport, setCleaningReport] = useState(product?.cleaningReport ?? "");

  // Booleans
  const [isOriginal, setIsOriginal] = useState(product?.isOriginal ?? true);
  const [hasManual, setHasManual] = useState(product?.hasManual ?? false);
  const [hasBox, setHasBox] = useState(product?.hasBox ?? false);
  const [isCib, setIsCib] = useState(product?.isCib ?? false);
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const formData: CreateProductInput = {
      title,
      description: description || undefined,
      platform: platform as any,
      condition: condition as any,
      region: region as any,
      priceInOre: Math.round(parseFloat(priceInOre || "0") * 100),
      salePriceInOre: salePriceInOre
        ? Math.round(parseFloat(salePriceInOre) * 100)
        : undefined,
      costPriceInOre: costPriceInOre
        ? Math.round(parseFloat(costPriceInOre) * 100)
        : undefined,
      quantity: parseInt(quantity || "0", 10),
      lowStockAt: 2,
      weight: weight ? parseInt(weight, 10) : undefined,
      barcode: barcode || undefined,
      serialNumber: serialNumber || undefined,
      videoUrl: videoUrl || undefined,
      testReport: testReport || undefined,
      cleaningReport: cleaningReport || undefined,
      isOriginal,
      hasManual,
      hasBox,
      isCib,
      isPublished,
      isFeatured,
    };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProductAction(formData)
          : await updateProductAction(product!.id, formData);

      if (result.success) {
        toast.success(
          mode === "create" ? "Product created" : "Product updated",
        );
        router.push("/admin/products");
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        toast.error(result.error);
      }
    });
  };

  const getError = (field: string) => fieldErrors[field]?.[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Super Mario World"
                  required
                />
                {getError("title") && (
                  <p className="text-sm text-destructive">{getError("title")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product condition, included items, etc."
                  rows={5}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select value={platform} onValueChange={(v) => v && setPlatform(v)} required>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((group) => (
                        <div key={group.group}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {group.group}
                          </div>
                          {group.items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  {getError("platform") && (
                    <p className="text-sm text-destructive">{getError("platform")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={condition} onValueChange={(v) => v && setCondition(v)} required>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getError("condition") && (
                    <p className="text-sm text-destructive">{getError("condition")}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={region} onValueChange={(v) => v && setRegion(v)}>
                  <SelectTrigger id="region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Completeness */}
          <Card>
            <CardHeader>
              <CardTitle>Completeness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isOriginal"
                    checked={isOriginal}
                    onCheckedChange={(checked) => setIsOriginal(checked === true)}
                  />
                  <Label htmlFor="isOriginal" className="cursor-pointer">
                    Original (not reproduction)
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="hasManual"
                    checked={hasManual}
                    onCheckedChange={(checked) => setHasManual(checked === true)}
                  />
                  <Label htmlFor="hasManual" className="cursor-pointer">
                    Manual included
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="hasBox"
                    checked={hasBox}
                    onCheckedChange={(checked) => setHasBox(checked === true)}
                  />
                  <Label htmlFor="hasBox" className="cursor-pointer">
                    Box included
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isCib"
                    checked={isCib}
                    onCheckedChange={(checked) => setIsCib(checked === true)}
                  />
                  <Label htmlFor="isCib" className="cursor-pointer">
                    Complete In Box (CIB)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (DKK) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={priceInOre}
                    onChange={(e) => setPriceInOre(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  {getError("priceInOre") && (
                    <p className="text-sm text-destructive">{getError("priceInOre")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (DKK)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={salePriceInOre}
                    onChange={(e) => setSalePriceInOre(e.target.value)}
                    placeholder="Leave empty if not on sale"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Purchase Price (DKK)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={costPriceInOre}
                    onChange={(e) => setCostPriceInOre(e.target.value)}
                    placeholder="What you paid"
                  />
                </div>
              </div>
              {priceInOre && costPriceInOre && (
                <p className="text-sm text-muted-foreground">
                  Profit margin:{" "}
                  <span className="font-medium text-green-600">
                    {(
                      ((parseFloat(priceInOre) - parseFloat(costPriceInOre)) /
                        parseFloat(priceInOre)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                  {" "}({(parseFloat(priceInOre) - parseFloat(costPriceInOre)).toFixed(2)} kr)
                </p>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="For shipping"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="EAN/UPC"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="If applicable"
                />
              </div>
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testReport">Test Report</Label>
                <Textarea
                  id="testReport"
                  value={testReport}
                  onChange={(e) => setTestReport(e.target.value)}
                  placeholder="Notes from testing the product..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cleaningReport">Cleaning Report</Label>
                <Textarea
                  id="cleaningReport"
                  value={cleaningReport}
                  onChange={(e) => setCleaningReport(e.target.value)}
                  placeholder="Notes from cleaning/refurbishing..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">Published</Label>
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured</Label>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle>Product Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono text-xs">{product.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(product.createdAt).toLocaleDateString("da-DK")}</span>
                </div>
                {product.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published</span>
                    <span>{new Date(product.publishedAt).toLocaleDateString("da-DK")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Image placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Drag & drop images here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max 10 images, 5MB each
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions - Sticky bottom bar */}
      <div className="sticky bottom-0 bg-background border-t py-4 -mx-6 px-6 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
