import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Download, Save, Trash2, FileText } from "lucide-react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

const MAX_LENGTH = 50;

interface FormData {
  textInput1: string;
  textInput2: string;
  textInput3: string;
}

const DocumentForm = () => {
  const [formData, setFormData] = useState<FormData>({
    textInput1: "",
    textInput2: "",
    textInput3: "",
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    if (!formData.textInput1 && !formData.textInput2 && !formData.textInput3) {
      toast({
        title: "Uwaga",
        description: "Wprowadź tekst w co najmniej jednym polu.",
        variant: "destructive",
      });
      return;
    }
    setIsSaved(true);
    toast({
      title: "Zapisano",
      description: "Dane zostały zapisane pomyślnie.",
    });
  };

  const handleDownload = async () => {
    if (!isSaved) {
      toast({
        title: "Uwaga",
        description: "Zapisz dane przed pobraniem dokumentu.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/template.docx");
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
      });

      doc.render({
        "text-input-1": formData.textInput1,
        "text-input-2": formData.textInput2,
        "text-input-3": formData.textInput3,
      });

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, "dokument.docx");
      
      toast({
        title: "Pobrano",
        description: "Dokument został pobrany pomyślnie.",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się wygenerować dokumentu.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setFormData({
      textInput1: "",
      textInput2: "",
      textInput3: "",
    });
    setIsSaved(false);
    toast({
      title: "Wyczyszczono",
      description: "Formularz został wyczyszczony.",
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-accent rounded-xl">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Generator dokumentów</h1>
            <p className="text-sm text-muted-foreground">Wypełnij pola i pobierz dokument</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input1" className="text-sm font-medium">
              Pole tekstowe 1
            </Label>
            <Input
              id="input1"
              value={formData.textInput1}
              onChange={handleInputChange("textInput1")}
              placeholder="Wprowadź tekst..."
              maxLength={MAX_LENGTH}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.textInput1.length}/{MAX_LENGTH}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input2" className="text-sm font-medium">
              Pole tekstowe 2
            </Label>
            <Input
              id="input2"
              value={formData.textInput2}
              onChange={handleInputChange("textInput2")}
              placeholder="Wprowadź tekst..."
              maxLength={MAX_LENGTH}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.textInput2.length}/{MAX_LENGTH}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input3" className="text-sm font-medium">
              Pole tekstowe 3
            </Label>
            <Input
              id="input3"
              value={formData.textInput3}
              onChange={handleInputChange("textInput3")}
              placeholder="Wprowadź tekst..."
              maxLength={MAX_LENGTH}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.textInput3.length}/{MAX_LENGTH}
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <Button onClick={handleSave} className="w-full" size="lg">
              <Save className="w-4 h-4" />
              SAVE
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              variant="success"
              className="flex-1"
              size="lg"
              disabled={!isSaved}
            >
              <Download className="w-4 h-4" />
              DOWNLOAD
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Trash2 className="w-4 h-4" />
              CLEAR
            </Button>
          </div>
        </div>

        {isSaved && (
          <div className="mt-6 p-4 bg-accent rounded-xl border border-primary/20 animate-fade-in">
            <p className="text-sm text-accent-foreground font-medium">
              ✓ Dane zapisane - możesz pobrać dokument
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentForm;
