// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { ArrowLeft, Send, Save, Eye, DollarSign, Clock, FileText, User } from 'lucide-react';

// import { useWeb3 } from '@/hooks/useWeb3';
// import { getEscrowInstance } from '@/lib/escrow';
// import { useAuthState } from "../hooks/useAuth";
// import { useToast } from '@/hooks/use-toast';
// import EscrowABI from '@/lib/Escrow.json';
// import { ethers } from 'ethers';
// import axios from "axios";
// import { CheckCircle } from 'lucide-react';

// const ESCROW_CONTRACT_ADDRESS = "0x21Ed0dC8810420c09a6507427F77fEF286121aC6";

// const ProposalPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { signer } = useWeb3();
//   const { user, isAuthenticated } = useAuthState();
//   const { toast } = useToast();

// type Gig = {
//   title: string;
//   minBudget: number;
//   maxBudget: number;
//   skills: string[];
//   category: string;
//   // Add other fields if used
// };

// const [gig, setGig] = useState<Gig | null>(null);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState<string | null>(null);

// const [coverLetter, setCoverLetter] = useState('');
// const [proposedBudget, setProposedBudget] = useState('');
// const [deliveryTime, setDeliveryTime] = useState('');
// const [isSubmitting, setIsSubmitting] = useState(false);
// const [isDraft, setIsDraft] = useState(false);
// const [isReleasing, setIsReleasing] = useState(false);
// const [txStatus, setTxStatus] = useState<string | null>(null);


// useEffect(() => {
//   const fetchGig = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/gigs/${id}`);
//       setGig(response.data);
//     } catch (err) {
//       setError("Failed to load gig data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (id) fetchGig();
// }, [id]);

//   const handleRelease = async () => {
//     if (!signer) {
//       setTxStatus("⚠ Please connect your wallet to proceed.");
//       return;
//     }
//     try {
//       setIsReleasing(true);
//       const contract = getEscrowInstance(signer, ESCROW_CONTRACT_ADDRESS);
//       const tx = await contract.releaseFunds();
//       await tx.wait();
//       setTxStatus("Funds released successfully!");
//     } catch (err: any) {
//       console.error("Release error:", err);
//       const code = err.code || err.info?.error?.code;
//       const message = err.reason || err.shortMessage || err.message || "Unknown error.";
//       setTxStatus(code === 4001 ? "Transaction rejected by user." : `Error: ${message}`);
//     } finally {
//       setIsReleasing(false);
//     }
//   };


// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user?._id) {
//       toast({ title: "Login Required", description: "You must be logged in to submit a proposal" });
//       return;
//     }
//     if (!signer) {
//       toast({ title: "Wallet Required", description: "Please connect your wallet" });
//       return;
//     }

//     setIsSubmitting(true);
//     let escrowAddress = "";

//     try {
//       const signerAddress = await signer.getAddress();
//       const contractFactory = new ethers.ContractFactory(EscrowABI.abi, EscrowABI.bytecode, signer);
//       const ethValue = ethers.parseEther(proposedBudget.toString());
//       const contract = await contractFactory.deploy(signerAddress, { value: ethValue });
//       await contract.deployed();
//       escrowAddress = contract.address;
//       console.log("✅ Escrow deployed:", escrowAddress);
//     } catch (err: any) {
//       toast({ title: "Contract Deployment Failed", description: err.message });
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await axios.post("http://localhost:8080/api/proposals", {
//         gigId: id,
//         userId: user._id,
//         coverLetter,
//         proposedBudget,
//         deliveryTime,
//         escrowAddress,
//       });

//       toast({ title: "Success", description: "Proposal submitted successfully!" });
//       navigate(`/gig/${id}`);
//     } catch (err) {
//       console.error("Proposal submission error:", err);
//       toast({ title: "Error", description: "Failed to submit proposal" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSaveDraft = () => {
//     setIsDraft(true);
//     toast({ title: "Draft Saved", description: "Proposal draft saved" });
//     setTimeout(() => setIsDraft(false), 2000);
//   };

//   const handlePreview = () => {
//     toast({ title: "Preview Mode", description: "Previewing your proposal" });
//   };

//   const handleBack = () => {
//     toast({ title: "Back to Gig", description: "Returning to gig details" });
//     navigate(`/gig/${id}`);
//   };

//   const isFormValid = coverLetter.trim() && proposedBudget && deliveryTime;

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   if (error || !gig) {
//     return (
//       <div className="text-center mt-10">
//         <h2 className="text-xl font-semibold">Gig Not Found</h2>
//         <p>{error || "Invalid gig ID"}</p>
//         <Button onClick={() => navigate('/freelance')}>Back to Freelance</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Button variant="outline" onClick={handleBack} className="mb-6">
//         <ArrowLeft className="w-4 h-4 mr-2" /> Back to Gig
//       </Button>

//       <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Form */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card className="glass-effect border-primary/20">
//             <CardHeader>
//               <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 Submit Your Proposal for "{gig.title}"
//               </CardTitle>
//               <div className="flex flex-wrap gap-2 mt-3">
//                 <Badge variant="secondary">Budget: ${gig.minBudget} - ${gig.maxBudget}</Badge>
//                 <Badge variant="outline">{gig.category.replace('-', ' ')}</Badge>
//                 <Badge variant="outline">{gig.skills?.length || 0} skills required</Badge>
//               </div>
//               <Button onClick={handlePreview} variant="outline" size="sm" className="mt-3">
//                 <Eye className="w-4 h-4 mr-1" /> Preview
//               </Button>
//             </CardHeader>
//           </Card>

//           <Card className="glass-effect">
//             <CardHeader>
//               <CardTitle className="flex items-center"><FileText className="w-5 h-5 mr-2" /> Proposal Details</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block mb-2 font-medium flex items-center">
//                     <User className="w-4 h-4 mr-2" /> Cover Letter *
//                   </label>
//                   <Textarea
//                     value={coverLetter}
//                     onChange={(e) => setCoverLetter(e.target.value)}
//                     rows={8}
//                     placeholder="Describe your experience and fit for this gig"
//                     required
//                     className="resize-none"
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-2 font-medium flex items-center">
//                       <DollarSign className="w-4 h-4 mr-2" /> Budget (in ETH) *
//                     </label>
//                     <Input
//                       type="number"
//                       value={proposedBudget}
//                       onChange={(e) => setProposedBudget(e.target.value)}
//                       required
//                       min={0.001}
//                       step={0.001}
//                       placeholder="e.g. 0.05"
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-2 font-medium flex items-center">
//                       <Clock className="w-4 h-4 mr-2" /> Delivery Time (days) *
//                     </label>
//                     <Input
//                       type="number"
//                       value={deliveryTime}
//                       onChange={(e) => setDeliveryTime(e.target.value)}
//                       min={1}
//                       max={365}
//                       required
//                       placeholder="e.g. 7"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                   <Button type="submit" className="flex-1 glow-button" disabled={isSubmitting || !isFormValid}>
//                     {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Proposal</>}
//                   </Button>
//                   <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={!coverLetter}>
//                     {isDraft ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Draft</>}
//                   </Button>
//                   <Button type="button" variant="outline" onClick={handleBack}>Cancel</Button>
//                 </div>
//               </form>

//               <div className="mt-10 border-t pt-6">
//                 <h3 className="text-lg font-semibold mb-4">Escrow Actions</h3>
//                 <Button onClick={handleRelease} disabled={isReleasing}>
//                   {isReleasing ? "Releasing..." : "Release Escrow"}
//                 </Button>
//                 {txStatus && (
//                   <p className={`mt-2 text-sm ${txStatus.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
//                     {txStatus}
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Tips Card */}
//           <Card className="glass-effect border-blue-200 bg-blue-50/50">
//             <CardHeader>
//               <CardTitle className="text-blue-800 text-lg">💡 Proposal Tips</CardTitle>
//             </CardHeader>
//             <CardContent className="text-sm text-blue-700 space-y-3">
//               <p>• Personalize your message</p>
//               <p>• Highlight relevant experience</p>
//               <p>• Be realistic with timeline</p>
//               <p>• Ask clarifying questions</p>
//               <p>• Proofread before submitting</p>
//             </CardContent>
//           </Card>

//           {/* Project Summary */}
//           <Card className="glass-effect">
//             <CardHeader>
//               <CardTitle className="text-lg">Project Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div>
//                 <p className="font-medium text-muted-foreground">Client Budget</p>
//                 <p className="font-semibold">${gig.minBudget} - ${gig.maxBudget}</p>
//               </div>
//               <div>
//                 <p className="font-medium text-muted-foreground">Required Skills</p>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {gig.skills.map((skill: string) => (
//                     <Badge key={skill} variant="outline" className="text-xs">
//                       {skill}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <p className="font-medium text-muted-foreground">Category</p>
//                 <p className="capitalize">{gig.category.replace('-', ' ')}</p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Checklist */}
//           <Card className="glass-effect">
//             <CardHeader>
//               <CardTitle className="text-lg">Checklist</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2 text-sm">
//               <div className={`flex items-center gap-2 ${coverLetter.trim() ? 'text-green-600' : 'text-muted-foreground'}`}>
//                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${coverLetter.trim() ? 'bg-green-600 border-green-600' : 'border-muted-foreground'}`}>
//                   {coverLetter.trim() && <span className="text-white text-xs">✓</span>}
//                 </div>
//                 Cover letter written
//               </div>

//               <div className={`flex items-center gap-2 ${proposedBudget ? 'text-green-600' : 'text-muted-foreground'}`}>
//                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${proposedBudget ? 'bg-green-600 border-green-600' : 'border-muted-foreground'}`}>
//                   {proposedBudget && <span className="text-white text-xs">✓</span>}
//                 </div>
//                 Budget proposed
//               </div>

//               <div className={`flex items-center gap-2 ${deliveryTime ? 'text-green-600' : 'text-muted-foreground'}`}>
//                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryTime ? 'bg-green-600 border-green-600' : 'border-muted-foreground'}`}>
//                   {deliveryTime && <span className="text-white text-xs">✓</span>}
//                 </div>
//                 Delivery time set
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalPage;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Save,
  Eye,
  DollarSign,
  Clock,
  FileText,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { useWeb3 } from "@/hooks/useWeb3";
import { getEscrowInstance } from "@/lib/escrow";
import { useAuthState } from "../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import EscrowABI from "@/lib/Escrow.json";
import { ethers } from "ethers";
import axios from "axios";

// const ESCROW_CONTRACT_ADDRESS = "0x21Ed0dC8810420c09a6507427F77fEF286121aC6";
const ESCROW_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // added new deployed address

type Gig = {
  title: string;
  minBudget: number;
  maxBudget: number;
  skills: string[];
  category: string;
};

const ProposalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { signer } = useWeb3();
  const { user, isAuthenticated } = useAuthState();
  const { toast } = useToast();

  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/${id}`);
        setGig(response.data);
      } catch (err) {
        setError("Failed to load gig data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGig();
  }, [id]);

  const handleRelease = async () => {
    if (!signer) {
      setTxStatus("⚠ Please connect your wallet to proceed.");
      return;
    }

    try {
      setIsReleasing(true);

      const contract = getEscrowInstance(signer, ESCROW_CONTRACT_ADDRESS);

      if (!contract) {
        setTxStatus("❌ Contract instance not found.");
        setIsReleasing(false);
        return;
      }

      // Get current wallet address to verify it's the client
      const currentAddress = await signer.getAddress();
      const clientAddress = await contract.i_client();

      if (currentAddress.toLowerCase() !== clientAddress.toLowerCase()) {
        setTxStatus("❌ Only the client who funded the escrow can release funds.");
        setIsReleasing(false);
        return;
      }

      // Check if funds are already released
      const isComplete = await contract.s_isComplete();
      if (isComplete) {
        setTxStatus("❌ Funds have already been released.");
        setIsReleasing(false);
        return;
      }

      // Call releaseFunds on the contract
      const tx = await contract.releaseFunds();
      setTxStatus("⏳ Transaction submitted, waiting for confirmation...");
      await tx.wait();

      setTxStatus("✅ Funds released successfully!");
    } catch (err: any) {
      console.error("Release error:", err);

      // Handle custom errors from the refactored contract
      let errorMessage = "Unknown error occurred";

      if (err.reason) {
        if (err.reason.includes("Escrow__NotClient")) {
          errorMessage = "Only the client can release funds";
        } else if (err.reason.includes("Escrow__FundsAlreadyReleased")) {
          errorMessage = "Funds have already been released";
        } else if (err.reason.includes("Escrow__InsufficientBalance")) {
          errorMessage = "Insufficient contract balance";
        } else if (err.reason.includes("Escrow__EtherTransferFailed")) {
          errorMessage = "Transfer to freelancer failed";
        } else {
          errorMessage = err.reason;
        }
      } else if (err.shortMessage) {
        errorMessage = err.shortMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      const code = err?.code || err?.error?.code || err?.info?.error?.code;
      setTxStatus(
        code === 4001
          ? "Transaction rejected by user."
          : `❌ Failed to release funds: ${errorMessage}`
      );
    } finally {
      setIsReleasing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      toast({
        title: "Login Required",
        description: "You must be logged in to submit a proposal",
      });
      return;
    }
    if (!signer) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet",
      });
      return;
    }

    setIsSubmitting(true);
    let escrowAddress = "";

    try {
      // Get freelancer address (for demo, using a placeholder)
      // In a real app, this would be the freelancer's address from the proposal
      const freelancerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Replace with actual freelancer address

      const factory = new ethers.ContractFactory(
        EscrowABI.abi,
        EscrowABI.bytecode,
        signer
      );

      const ethValue = ethers.parseEther(proposedBudget.toString());

      // Deploy escrow contract with the freelancer's address, funded by the client (signer)
      // The signer here is assumed to be the client, who should be connected and have sufficient ETH
      const contract = await factory.deploy(freelancerAddress, { value: ethValue });

      const receipt = await contract.waitForDeployment();
      escrowAddress = await contract.getAddress();

      console.log("✅ Escrow deployed at:", escrowAddress);

      toast({
        title: "Contract Deployed",
        description: `Escrow created at ${escrowAddress}`,
      });
    } catch (err: any) {
      console.error("Contract deployment error:", err);

      let errorMessage = "Failed to deploy escrow contract";

      if (err.reason) {
        if (err.reason.includes("Escrow__NoEtherSent")) {
          errorMessage = "Must send ETH when creating escrow";
        } else if (err.reason.includes("Escrow__InvalidFreelancerAddress")) {
          errorMessage = "Invalid freelancer address";
        } else {
          errorMessage = err.reason;
        }
      }

      toast({
        title: "Contract Deployment Failed",
        description: errorMessage
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/proposals`, {
        gigId: id,
        userId: user._id,
        coverLetter,
        proposedBudget,
        deliveryTime,
        escrowAddress,
      });

      toast({
        title: "Success",
        description: "Proposal submitted successfully!",
      });
      navigate(`/gig/${id}`);
    } catch (err) {
      console.error("Proposal submission error:", err);
      toast({ title: "Error", description: "Failed to submit proposal" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    toast({ title: "Draft Saved", description: "Proposal draft saved" });
    setTimeout(() => setIsDraft(false), 2000);
  };

  const handlePreview = () => {
    toast({ title: "Preview Mode", description: "Previewing your proposal" });
  };

  const handleBack = () => {
    toast({ title: "Back to Gig", description: "Returning to gig details" });
    navigate(`/gig/${id}`);
  };

  const isFormValid = coverLetter.trim() && proposedBudget && deliveryTime;

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (error || !gig) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold">Gig Not Found</h2>
        <p>{error || "Invalid gig ID"}</p>
        <Button onClick={() => navigate("/freelance")}>Back to Freelance</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={handleBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Gig
      </Button>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Submit Your Proposal for "{gig.title}"
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">
                  Budget: ${gig.minBudget} - ${gig.maxBudget}
                </Badge>
                <Badge variant="outline">{gig.category.replace("-", " ")}</Badge>
                <Badge variant="outline">{gig.skills.length} skills required</Badge>
              </div>
              <Button
                onClick={handlePreview}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <Eye className="w-4 h-4 mr-1" /> Preview
              </Button>
            </CardHeader>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" /> Proposal Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" /> Cover Letter *
                  </label>
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={8}
                    required
                    className="resize-none"
                    placeholder="Describe your experience and fit for this gig"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" /> Budget (ETH) *
                    </label>
                    <Input
                      type="number"
                      value={proposedBudget}
                      onChange={(e) => setProposedBudget(e.target.value)}
                      required
                      min={0.001}
                      step={0.001}
                      placeholder="e.g. 0.05"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> Delivery Time (days) *
                    </label>
                    <Input
                      type="number"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      min={1}
                      max={365}
                      required
                      placeholder="e.g. 7"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 glow-button"
                    disabled={isSubmitting || !isFormValid}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Submit Proposal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={!coverLetter}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isDraft ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-effect border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Escrow Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="default"
                onClick={handleRelease}
                disabled={isReleasing}
              >
                {isReleasing ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Releasing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" /> Release Funds
                  </>
                )}
              </Button>
              {txStatus && (
                <p className="text-sm mt-4 text-muted-foreground">{txStatus}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Tips Card */}
          <Card className="glass-effect border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">💡 Proposal Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 space-y-3">
              <p>• Personalize your message to the specific project</p>
              <p>• Highlight relevant experience and portfolio pieces</p>
              <p>• Be realistic with your timeline and budget</p>
              <p>• Ask clarifying questions to show engagement</p>
              <p>• Proofread before submitting</p>
            </CardContent>
          </Card>

          {/* Project Summary */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Client Budget</p>
                <p className="font-semibold">${gig.minBudget} - ${gig.maxBudget}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Required Skills</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {gig.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Category</p>
                <p className="capitalize">{gig.category.replace('-', ' ')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Form Validation */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className={`flex items-center gap-2 ${coverLetter.trim() ? 'text-green-600' : 'text-muted-foreground'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${coverLetter.trim() ? 'bg-green-600 border-green-600' : 'border-muted-foreground'}`}>
                  {coverLetter.trim() && <span className="text-white text-xs">✓</span>}
                </div>
                Cover letter written
              </div>
              <div className={`flex items-center gap-2 ${proposedBudget ? 'text-green-600' : 'text-muted-foreground'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${proposedBudget ? 'bg-green-600 border-green-600' : 'border-muted-foreground'}`}>
                  {proposedBudget && <span className="text-white text-xs">✓</span>}
                </div>
                Budget proposed
              </div>
              <div className={`flex items-center gap-2 ${deliveryTime ? 'text-green-600' : 'text-muted-foreground'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryTime ? 'bg-green-600 border-green-600' : 'border-muted-foreground'}`}>
                  {deliveryTime && <span className="text-white text-xs">✓</span>}
                </div>
                Delivery time set
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;
