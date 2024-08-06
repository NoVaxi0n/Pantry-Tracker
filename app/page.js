"use client"; // This marks the component as a Client Component

import { firestore } from "@/firebase";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(pantryList);
  };

  useEffect(() => {
    (async () => {
      await updatePantry();
    })();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const currentQuantity =
        typeof data.quantity === "number" ? data.quantity : 0;
      await updateDoc(docRef, {
        quantity: currentQuantity + 1,
      });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    updatePantry();
  };

  const incrementQuantity = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item.id);
    const newQuantity = item.quantity + 1;
    await updateDoc(docRef, { quantity: newQuantity });
    updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const currentQuantity =
        typeof data.quantity === "number" ? data.quantity : 0;

      if (currentQuantity > 1) {
        await updateDoc(docRef, {
          quantity: currentQuantity - 1,
        });
      } else {
        await deleteDoc(docRef);
      }
    }
    updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Button variant="contained" onClick={handleOpen}>
        Add Item
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              value={itemName}
              fullWidth
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box border={"1px solid #333"} borderRadius="8px" overflow="hidden">
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h3" color={"#333"} textAlign={"center"}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" spacing={2} padding={2}>
          {items.map((item) => (
            <Box
              key={item.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              padding={2}
              borderRadius="8px"
            >
              <Typography variant="h6" color="#333">
                {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333">
                Quantity: {item.quantity}
              </Typography>
              <Button
                variant="contained"
                onClick={() => incrementQuantity(item)}
              >
                Add
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
