import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Download, Trash2, FileText } from "lucide-react";
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

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDownload = async () => {
    if (!formData.textInput1 && !formData.textInput2 && !formData.textInput3) {
      toast({
        title: "Warning",
        description: "Please enter text in at least one field.",
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

      saveAs(out, "document.docx");
      
      toast({
        title: "Downloaded",
        description: "Document has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document.",
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
    toast({
      title: "Cleared",
      description: "Form has been cleared.",
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
            <h1 className="text-2xl font-bold text-foreground">Document Generator</h1>
            <p className="text-sm text-muted-foreground">Fill in the fields and download your document</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input1" className="text-sm font-medium">
              Text Field 1
            </Label>
            <Input
              id="input1"
              value={formData.textInput1}
              onChange={handleInputChange("textInput1")}
              placeholder="Enter text..."
              maxLength={MAX_LENGTH}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.textInput1.length}/{MAX_LENGTH}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input2" className="text-sm font-medium">
              Text Field 2
            </Label>
            <Input
              id="input2"
              value={formData.textInput2}
              onChange={handleInputChange("textInput2")}
              placeholder="Enter text..."
              maxLength={MAX_LENGTH}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.textInput2.length}/{MAX_LENGTH}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input3" className="text-sm font-medium">
              Text Field 3
            </Label>
            <Input
              id="input3"
              value={formData.textInput3}
              onChange={handleInputChange("textInput3")}
              placeholder="Enter text..."
              maxLength={MAX_LENGTH}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.textInput3.length}/{MAX_LENGTH}
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleDownload}
              variant="success"
              className="flex-1"
              size="lg"
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
      </div>
    </div>
  );
};

export default DocumentForm;
