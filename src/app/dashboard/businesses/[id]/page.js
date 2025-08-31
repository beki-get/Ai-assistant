// src/app/dashboard/businesses/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Stack,
  Collapse,
  Image,
  FormLabel,
  Divider,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  // Fetch business details
  useEffect(() => {
    const fetchBusiness = async () => {
      const docRef = doc(db, "businesses", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setBusiness({ id: docSnap.id, ...docSnap.data() });
    };
    fetchBusiness();
  }, [id]);

  // Add note
  const handleAddNote = async () => {
    if (!note.trim()) return;
    setLoading(true);
    const docRef = doc(db, "businesses", id);
    const newNote = { text: note, date: new Date().toISOString() };
    await updateDoc(docRef, { notes: arrayUnion(newNote) });
    setBusiness(prev => ({ ...prev, notes: [...(prev.notes || []), newNote] }));
    setNote("");
    setLoading(false);
  };

  // Update a field (description, hours, contact, theme, etc.)
  const handleUpdateField = async (fieldPath, value) => {
    const docRef = doc(db, "businesses", id);
    await updateDoc(docRef, { [fieldPath]: value });
    setBusiness(prev => {
      const updated = { ...prev };
      const keys = fieldPath.split(".");
      let temp = updated;
      for (let i = 0; i < keys.length - 1; i++) temp = temp[keys[i]];
      temp[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (!business) return <Text>Loading business details...</Text>;

  return (
    <Box p={8} bgGradient="linear(to-r, teal.50, pink.50)" minH="100vh">
      <Heading mb={6} textAlign="center" color="pink.700">
        Business Details: {business.name}
      </Heading>

      <VStack spacing={4} mb={8} align="stretch">
        {/* Description */}
        <FormLabel>Description:</FormLabel>
        <Textarea
          value={business.description || ""}
          onChange={e => setBusiness(prev => ({ ...prev, description: e.target.value }))}
          onBlur={e => handleUpdateField("description", e.target.value)}
        />

        {/* Contact Info */}
        <Heading size="md">Contact Info</Heading>
        <Input
          placeholder="Email"
          value={business.contact?.email || ""}
          onChange={e =>
            setBusiness(prev => ({
              ...prev,
              contact: { ...prev.contact, email: e.target.value }
            }))
          }
          onBlur={e => handleUpdateField("contact.email", e.target.value)}
        />
        <Input
          placeholder="Phone"
          value={business.contact?.phone || ""}
          onChange={e =>
            setBusiness(prev => ({
              ...prev,
              contact: { ...prev.contact, phone: e.target.value }
            }))
          }
          onBlur={e => handleUpdateField("contact.phone", e.target.value)}
        />
        <Input
          placeholder="Map link"
          value={business.contact?.map || ""}
          onChange={e =>
            setBusiness(prev => ({
              ...prev,
              contact: { ...prev.contact, map: e.target.value }
            }))
          }
          onBlur={e => handleUpdateField("contact.map", e.target.value)}
        />

        {/* Hours */}
        <Input
          placeholder="Business Hours"
          value={business.hours || ""}
          onChange={e => setBusiness(prev => ({ ...prev, hours: e.target.value }))}
          onBlur={e => handleUpdateField("hours", e.target.value)}
        />

        <Divider />

        {/* Products */}
        <Heading size="md">Products / Services</Heading>
        {business.products?.map((p, idx) => (
          <HStack key={idx} spacing={2}>
            <Input
              placeholder="Product Name"
              value={p.name}
              onChange={e => {
                const newProducts = [...business.products];
                newProducts[idx].name = e.target.value;
                setBusiness(prev => ({ ...prev, products: newProducts }));
              }}
              onBlur={e => handleUpdateField(`products.${idx}.name`, e.target.value)}
            />
            <Input
              placeholder="Price"
              type="number"
              value={p.price}
              onChange={e => {
                const newProducts = [...business.products];
                newProducts[idx].price = parseFloat(e.target.value);
                setBusiness(prev => ({ ...prev, products: newProducts }));
              }}
              onBlur={e => handleUpdateField(`products.${idx}.price`, parseFloat(e.target.value))}
            />
          </HStack>
        ))}

        <Button
          colorScheme="green"
          size="sm"
          onClick={() => {
            const newProducts = [...(business.products || []), { name: "", price: 0 }];
            setBusiness(prev => ({ ...prev, products: newProducts }));
          }}
        >
          + Add Product
        </Button>

        <Divider />

        {/* FAQs */}
        <Heading size="md">FAQs</Heading>
        {business.faqs?.map((f, idx) => (
          <VStack key={idx} spacing={1} align="stretch">
            <Input
              placeholder="Question"
              value={f.q}
              onChange={e => {
                const newFaqs = [...business.faqs];
                newFaqs[idx].q = e.target.value;
                setBusiness(prev => ({ ...prev, faqs: newFaqs }));
              }}
              onBlur={e => handleUpdateField(`faqs.${idx}.q`, e.target.value)}
            />
            <Input
              placeholder="Answer"
              value={f.a}
              onChange={e => {
                const newFaqs = [...business.faqs];
                newFaqs[idx].a = e.target.value;
                setBusiness(prev => ({ ...prev, faqs: newFaqs }));
              }}
              onBlur={e => handleUpdateField(`faqs.${idx}.a`, e.target.value)}
            />
          </VStack>
        ))}

        <Button
          colorScheme="green"
          size="sm"
          onClick={() => {
            const newFaqs = [...(business.faqs || []), { q: "", a: "" }];
            setBusiness(prev => ({ ...prev, faqs: newFaqs }));
          }}
        >
          + Add FAQ
        </Button>

        <Divider />

        {/* Theme / Logo */}
        <Heading size="md">Theme & Logo</Heading>
        <Input
          placeholder="Logo URL"
          value={business.theme?.logoURL || ""}
          onChange={e =>
            setBusiness(prev => ({
              ...prev,
              theme: { ...prev.theme, logoURL: e.target.value }
            }))
          }
          onBlur={e => handleUpdateField("theme.logoURL", e.target.value)}
        />
        <Input
          placeholder="Primary Color"
          value={business.theme?.primaryColor || "#FFFFFF"}
          onChange={e =>
            setBusiness(prev => ({
              ...prev,
              theme: { ...prev.theme, primaryColor: e.target.value }
            }))
          }
          onBlur={e => handleUpdateField("theme.primaryColor", e.target.value)}
        />
        {business.theme?.logoURL && (
          <Image src={business.theme.logoURL} alt="Logo" boxSize="100px" mt={2} />
        )}

        <Divider />

        {/* Notes */}
        <Heading size="md">Admin Notes</Heading>
        <Textarea
          placeholder="Add note..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <Button colorScheme="pink" onClick={handleAddNote} isLoading={loading}>
          Add Note
        </Button>

        <Stack spacing={4} align="stretch">
          {(business.notes || []).length === 0 ? (
            <Text textAlign="center" color="gray.500">
              No notes yet.
            </Text>
          ) : (
            business.notes.map((n, idx) => (
              <Collapse in key={idx}>
                <Box p={3} borderRadius="md" shadow="md" bg="white">
                  <Text fontSize="sm" color="gray.500">
                    {new Date(n.date).toLocaleString()}
                  </Text>
                  <Text>{n.text}</Text>
                </Box>
              </Collapse>
            ))
          )}
        </Stack>
      </VStack>
    </Box>
  );
}
