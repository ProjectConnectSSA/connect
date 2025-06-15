"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Globe,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ArrowRight,
} from "lucide-react";

interface DomainSettingsProps {
  content: any;
  setContent: (content: any) => void;
}

export function DomainSettings({ content, setContent }: DomainSettingsProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  // Initialize domain if it doesn't exist
  useEffect(() => {
    if (!content.domain) {
      setContent({
        ...content,
        domain: {
          subdomain: "",
          custom: "",
          status: "unverified",
        },
      });
    }
  }, [content, setContent]);

  const handleSubdomainChange = (value: string) => {
    setContent({
      ...content,
      domain: {
        ...content.domain,
        subdomain: value,
      },
    });
  };

  const handleCustomDomainChange = (value: string) => {
    setContent({
      ...content,
      domain: {
        ...content.domain,
        custom: value,
      },
    });
  };

  const handleVerifyDomain = () => {
    setIsVerifying(true);
    // Simulate domain verification
    setTimeout(() => {
      setIsVerifying(false);
      setContent({
        ...content,
        domain: {
          ...content.domain,
          status: "verified",
        },
      });
      toast.success("Domain verified successfully!");
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Add null check before rendering
  const domain = content.domain || {
    subdomain: "",
    custom: "",
    status: "unverified",
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Domain Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your landing page domain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subdomain</CardTitle>
            <CardDescription>
              Choose a subdomain for your landing page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={domain.subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                placeholder="your-page"
              />
              <span>.yourdomain.com</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your page will be available at{" "}
              <code className="text-primary">
                {domain.subdomain}.yourdomain.com
              </code>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Custom Domain</CardTitle>
                <CardDescription>
                  Use your own domain for your landing page
                </CardDescription>
              </div>
              <Badge
                variant={domain.status === "verified" ? "success" : "secondary"}
              >
                {domain.status === "verified" ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Domain Name</Label>
              <div className="flex gap-2">
                <Input
                  value={domain.custom}
                  onChange={(e) => handleCustomDomainChange(e.target.value)}
                  placeholder="www.yourdomain.com"
                />
                <Button
                  onClick={handleVerifyDomain}
                  disabled={!domain.custom || isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>

            {domain.custom && domain.status !== "verified" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Domain Verification Required</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-4">
                    <p>Add the following DNS records to verify your domain:</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg border p-2">
                        <div>
                          <p className="font-mono text-sm">Type: CNAME</p>
                          <p className="font-mono text-sm">Name: www</p>
                          <p className="font-mono text-sm">
                            Value: cname.yourdomain.com
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            copyToClipboard("cname.yourdomain.com")
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
                    </div>

                    <p className="text-sm text-muted-foreground">
                      DNS changes can take up to 24 hours to propagate.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {domain.status === "verified" && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Domain Verified</AlertTitle>
                <AlertDescription>
                  Your domain is properly configured and ready to use.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
