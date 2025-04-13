
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, DownloadCloud } from 'lucide-react';
import { useAuth } from '@/contexts/MockAuthContext';
import Footer from '@/components/Footer';

// NGO data
const ngoList = [
  {
    id: 1,
    name: "Goonj",
    description: "Goonj works on disaster relief, humanitarian aid and community development in rural areas across India.",
    website: "https://goonj.org/",
    logo: "/placeholder.svg" 
  },
  {
    id: 2,
    name: "HelpAge India",
    description: "HelpAge India works for the cause and care of disadvantaged older persons to improve their quality of life.",
    website: "https://www.helpageindia.org/",
    logo: "/placeholder.svg"
  },
  {
    id: 3,
    name: "CRY (Child Rights and You)",
    description: "CRY works towards ensuring happy, healthy and creative childhoods for underprivileged children.",
    website: "https://www.cry.org/",
    logo: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Smile Foundation",
    description: "Smile Foundation works for the welfare of children, their families and communities through health, education and livelihood programs.",
    website: "https://www.smilefoundationindia.org/",
    logo: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Akshaya Patra Foundation",
    description: "The Akshaya Patra Foundation works to eliminate classroom hunger by providing mid-day meals to government school children.",
    website: "https://www.akshayapatra.org/",
    logo: "/placeholder.svg"
  }
];

// Payment options for Mentors and Secretary
const paymentOptions = [
  {
    id: "upi",
    name: "UPI",
    description: "Pay using any UPI app (Google Pay, PhonePe, etc.)",
    qrCode: "/placeholder.svg",
    upiId: "nss@upi"
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Transfer directly to our bank account",
    accountDetails: {
      accNumber: "1234567890",
      ifsc: "SBIN0001234",
      name: "NSS IIT Patna",
      bank: "State Bank of India"
    }
  }
];

const DonationPage = () => {
  const { user } = useAuth();
  const isMentorOrSecretary = user?.role === 'mentor' || user?.role === 'secretary';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">Donate to Make a Difference</h1>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-8">
          <p className="text-blue-800">
            NSS encourages contributing to reputable NGOs working for social causes. 
            Below is a curated list of organizations you can consider supporting.
          </p>
        </div>
        
        {/* Donation options for Mentors and Secretary */}
        {isMentorOrSecretary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">NSS Donation Portal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentOptions.map(option => (
                <Card key={option.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {option.id === "upi" ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg mb-3 w-40 h-40 flex items-center justify-center">
                          <img src={option.qrCode} alt="UPI QR Code" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-center text-sm font-medium">{option.upiId}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm"><span className="font-medium">Account Number:</span> {option.accountDetails.accNumber}</p>
                        <p className="text-sm"><span className="font-medium">IFSC Code:</span> {option.accountDetails.ifsc}</p>
                        <p className="text-sm"><span className="font-medium">Account Name:</span> {option.accountDetails.name}</p>
                        <p className="text-sm"><span className="font-medium">Bank:</span> {option.accountDetails.bank}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {option.id === "upi" ? (
                      <Button asChild variant="outline" className="w-full">
                        <a href={option.qrCode} download="nss-upi-qr.png" className="flex items-center justify-center gap-2">
                          <DownloadCloud className="h-4 w-4" /> Download QR Code
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" 
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `Account: ${option.accountDetails.accNumber}, IFSC: ${option.accountDetails.ifsc}, Name: ${option.accountDetails.name}`
                          );
                          alert('Account details copied to clipboard');
                        }}
                      >
                        Copy Account Details
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* NGO options for all users */}
        <h2 className="text-xl font-semibold mb-4">Other Ways to Donate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngoList.map(ngo => (
            <Card key={ngo.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-14 w-14 mb-2">
                  <img src={ngo.logo} alt={ngo.name} className="h-full w-full object-contain" />
                </div>
                <CardTitle>{ngo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 min-h-[80px]">
                  {ngo.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonationPage;
