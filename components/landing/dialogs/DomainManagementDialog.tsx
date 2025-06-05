import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Copy,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface DomainManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPage: any;
  onSave: (updatedContent: any) => Promise<void>;
}

export function DomainManagementDialog({
  open,
  onOpenChange,
  landingPage,
  onSave,
}: DomainManagementDialogProps) {
  const [domainSettings, setDomainSettings] = useState({
    useCustomDomain: landingPage?.useCustomDomain || false,
    customDomain: landingPage?.customDomain || "",
    customPath: landingPage?.customPath || "",
    isSubdomain: landingPage?.isSubdomain || true,
    status: landingPage?.status || "unverified",
  });

  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    null | "valid" | "invalid"
  >(null);
  const [isSaving, setIsSaving] = useState(false);

  // Create the default link from the landingPage id
  const defaultLink = `yoursite.com/landing/${landingPage?.id || ""}`;
  const customLink = domainSettings.useCustomDomain
    ? domainSettings.isSubdomain
      ? `${domainSettings.customDomain}.yoursite.com/${domainSettings.customPath}`
      : `${domainSettings.customDomain}/${domainSettings.customPath}`
    : defaultLink;

  // Update domain settings when landingPage changes
  useEffect(() => {
    if (landingPage) {
      setDomainSettings({
        useCustomDomain: landingPage.useCustomDomain || false,
        customDomain: landingPage.customDomain || "",
        customPath: landingPage.customPath || "",
        isSubdomain: landingPage.isSubdomain || true,
        status: landingPage.status || "unverified",
      });
    }
  }, [landingPage]);

  const validateDomain = async () => {
    if (!domainSettings.customDomain) return;

    setIsValidating(true);
    setValidationStatus(null);

    try {
      // Mock API call for domain validation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example validation logic - in a real app, this would be a server-side check
      const isValid =
        domainSettings.customDomain.includes(".") &&
        !domainSettings.customDomain.includes(" ");

      setValidationStatus(isValid ? "valid" : "invalid");

      // If valid, update the status
      if (isValid) {
        setDomainSettings((prev) => ({
          ...prev,
          status: "verified",
        }));
        toast.success("Domain verified successfully!");
      }
    } catch (error) {
      console.error("Error validating domain:", error);
      setValidationStatus("invalid");
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...landingPage,
        ...domainSettings,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving domain settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800 max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="dark:text-gray-100">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Domain Management
            </div>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Configure how visitors will access your landing page.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
              <TabsTrigger value="ssl">SSL Certificate</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Default URL Display */}
              <Card>
                <CardHeader>
                  <CardTitle>Default URL</CardTitle>
                  <CardDescription>
                    The default URL for your landing page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm flex-1 truncate dark:text-gray-300">
                      {defaultLink}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 dark:border-gray-700 dark:text-gray-300"
                      onClick={() =>
                        window.open(`https://${defaultLink}`, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Domain Toggle */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Use Custom Domain</CardTitle>
                      <CardDescription>
                        Enable to use your own domain or subdomain
                      </CardDescription>
                    </div>
                    <Switch
                      checked={domainSettings.useCustomDomain}
                      onCheckedChange={(checked) =>
                        setDomainSettings({
                          ...domainSettings,
                          useCustomDomain: checked,
                        })
                      }
                    />
                  </div>
                </CardHeader>
              </Card>

              {/* Custom Domain Fields - shown only when custom domain is enabled */}
              {domainSettings.useCustomDomain && (
                <Card>
                  <CardHeader>
                    <CardTitle>Domain Configuration</CardTitle>
                    <CardDescription>
                      Set up your custom domain or subdomain
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="domain-type"
                        className="dark:text-gray-300"
                      >
                        Domain Type
                      </Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="subdomain"
                            name="domain-type"
                            checked={domainSettings.isSubdomain}
                            onChange={() =>
                              setDomainSettings({
                                ...domainSettings,
                                isSubdomain: true,
                              })
                            }
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                          <Label
                            htmlFor="subdomain"
                            className="dark:text-gray-300"
                          >
                            Subdomain
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="custom-domain"
                            name="domain-type"
                            checked={!domainSettings.isSubdomain}
                            onChange={() =>
                              setDomainSettings({
                                ...domainSettings,
                                isSubdomain: false,
                              })
                            }
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                          <Label
                            htmlFor="custom-domain"
                            className="dark:text-gray-300"
                          >
                            Custom Domain
                          </Label>
                        </div>
                      </div>
                    </div>

                    {domainSettings.isSubdomain ? (
                      <div className="grid gap-2">
                        <Label
                          htmlFor="subdomain-name"
                          className="dark:text-gray-300"
                        >
                          Subdomain Name
                        </Label>
                        <div className="flex items-center">
                          <Input
                            id="subdomain-name"
                            placeholder="your-brand"
                            value={domainSettings.customDomain}
                            onChange={(e) =>
                              setDomainSettings({
                                ...domainSettings,
                                customDomain: e.target.value,
                              })
                            }
                            className="rounded-r-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                          />
                          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-r-md dark:text-gray-300">
                            .yoursite.com
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="custom-domain-name"
                            className="dark:text-gray-300"
                          >
                            Custom Domain
                          </Label>
                          <Badge
                            variant={
                              domainSettings.status === "verified"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {domainSettings.status === "verified"
                              ? "Verified"
                              : "Unverified"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Input
                            id="custom-domain-name"
                            placeholder="yourbrand.com"
                            value={domainSettings.customDomain}
                            onChange={(e) =>
                              setDomainSettings({
                                ...domainSettings,
                                customDomain: e.target.value,
                                status: "unverified", // Reset status when domain changes
                              })
                            }
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                          />
                          <Button
                            variant="outline"
                            onClick={validateDomain}
                            disabled={
                              isValidating || !domainSettings.customDomain
                            }
                            className="dark:border-gray-700 dark:text-gray-300"
                          >
                            {isValidating ? (
                              <span className="flex items-center gap-1">
                                <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                                Checking...
                              </span>
                            ) : (
                              "Verify"
                            )}
                          </Button>
                        </div>
                        {validationStatus === "valid" && (
                          <Alert>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertTitle>Domain Verified</AlertTitle>
                            <AlertDescription>
                              Your domain is properly configured and ready to
                              use.
                            </AlertDescription>
                          </Alert>
                        )}
                        {validationStatus === "invalid" && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Invalid Domain</AlertTitle>
                            <AlertDescription>
                              The domain format is invalid or the domain is
                              unavailable.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label
                        htmlFor="custom-path"
                        className="dark:text-gray-300"
                      >
                        Custom Path (optional)
                      </Label>
                      <Input
                        id="custom-path"
                        placeholder="landing"
                        value={domainSettings.customPath}
                        onChange={(e) =>
                          setDomainSettings({
                            ...domainSettings,
                            customPath: e.target.value,
                          })
                        }
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>DNS Configuration</CardTitle>
                  <CardDescription>
                    Configure your DNS records for custom domain setup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Domain Verification Required</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-4">
                        <p>
                          Add the following DNS records to verify your domain:
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-lg border p-2">
                            <div>
                              <p className="font-mono text-sm">Type: CNAME</p>
                              <p className="font-mono text-sm">Name: www</p>
                              <p className="font-mono text-sm">
                                Value: cname.yoursite.com
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                copyToClipboard("cname.yoursite.com")
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between rounded-lg border p-2">
                            <div>
                              <p className="font-mono text-sm">Type: TXT</p>
                              <p className="font-mono text-sm">Name: @</p>
                              <p className="font-mono text-sm">
                                Value: verify=abc123
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard("verify=abc123")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between rounded-lg border p-2">
                            <div>
                              <p className="font-mono text-sm">Type: A</p>
                              <p className="font-mono text-sm">Name: @</p>
                              <p className="font-mono text-sm">
                                Value: 123.45.67.89
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard("123.45.67.89")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          DNS changes can take up to 24 hours to propagate.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ssl" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SSL Certificate</CardTitle>
                  <CardDescription>
                    Secure your landing page with HTTPS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertTitle>SSL Active</AlertTitle>
                    <AlertDescription>
                      Your landing page is secured with SSL encryption.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview of the URL */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md mt-4 flex-shrink-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Your landing page will be accessible at:
          </p>
          <code className="bg-white dark:bg-gray-700 px-3 py-1 rounded text-sm block dark:text-gray-300">
            https://{customLink}
          </code>
        </div>

        <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
