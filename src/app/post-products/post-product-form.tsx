"use client";
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import AWS from "aws-sdk";
import { File } from "buffer";
import CustomInputField from "@/components/CustomInputField";
import CustomSelect from "@/components/CustomDropdown";
import CustomLoader from "@/components/CustomLoader"
import { CustomToastVariant } from "@/components/CustomToast";
import CustomToast from "@/components/CustomToast";


interface FileWithPreview extends File {
  preview: string;
}

interface DropzoneProps {
  onDrop: (
    acceptedFiles: FileWithPreview[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  accept: string[];
}

const dropzoneStyles = {
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

const S3_BUCKET = "shoppingwebsitenode";
const REGION = "ap-south-1";

const initialState = {
  brand: '',
  name: '',
  description: '',
  category: '',
  gender: '',
  price: '',
  catelogueUrls: [],
  ageGroup: ''
}

export default function MultipleFileUpload() {
  const [files, setFiles]: [
    FileWithPreview[],
    Dispatch<SetStateAction<FileWithPreview[]>>
  ] = useState<FileWithPreview[]>([]);
  const [folderName, setFolderName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [toastData, setToastData] = useState({
    open: false,
    message: "",
    severity: "info" as CustomToastVariant,
  });
  const [loading, setLoading] = useState(false)
  const [productDetails, setproductDetails] = useState<{
    brand: string;
    name: string;
    description: string;
    category: string;
    gender: string;
    price: string;
    catelogueUrls: string[];
    ageGroup: string;
  }>(initialState)

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (acceptedFiles.length > 0) {
        setFiles(
          (prevFiles) => [...prevFiles, ...acceptedFiles] as FileWithPreview[]
        );
      }

      if (fileRejections.length > 0) {
        // Handle file rejections, if needed
        console.log("Some files were rejected:", fileRejections);
      }
    },
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "video/mp4": [".mp4"],
    },
  });

  const postProduct = async ({products}: any) => {
    console.log({products})
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + "products/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": sessionStorage.getItem("token") || ""
          },
          body: JSON.stringify({
            brand: productDetails?.brand,
            name: productDetails?.name,
            description: productDetails?.description,
            category: productDetails?.category,
            gender: productDetails?.gender,
            price: productDetails?.price,
            ageGroup: productDetails?.ageGroup,
            catelogueUrls: products
          }),
        }
      );
      const data = await res.json()
      console.log({data})
      if (res.ok) {
        // const data = await res.json();
        setLoading(false)

        console.log({ data });
        const token = data?.token;

        sessionStorage.setItem("token", token);
        console.log("Product Uploaded Successfully");
        setToastData({
          open: true,
          message: "Product Uploaded Successfully",
          severity: "success" as CustomToastVariant,
        });
        setproductDetails(initialState)
        setUploadedFiles([])
        // router.push("/post-products");
      } else {
        setLoading(false)
        console.log("Product Upload failed", data?.error);
        setToastData({
          open: true,
          message: `Product Upload failed ${data?.error}`,
          severity: "error" as CustomToastVariant,
        });
      }
    } catch (err) {
      setLoading(false)
      console.log({ err });
      setToastData({
        open: true,
        message: `Something went wrong: ${err}`,
        severity: "error" as CustomToastVariant,
      });
    }
  };

  const uploadFiles = async () => {
    setLoading(true)

    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEYID_AWS,
      secretAccessKey: process.env.NEXT_PUBLIC_SECRETACCESSKEY_AWS,
    });

    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const uploadPromises = files.map((file) => {
      const params = {
        Bucket: S3_BUCKET,
        Key: `${productDetails?.name}/${file.name}`,
        Body: file,
      };

      return s3.upload(params).promise();
    });

    try {
      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.map((result) => result.Location);
      setUploadedFiles(uploadedUrls);
      setproductDetails({...productDetails, catelogueUrls: uploadedFiles})
      setToastData({
        open: true,
        message: `Files uploaded Successfully`,
        severity: "success" as CustomToastVariant,
      });
      console.log({productDetails})
      postProduct({products: uploadedUrls})
    } catch (error) {
      setLoading(false)
      console.error("Error uploading files:", error);
      setToastData({
        open: true,
        message: `Something went wrong: ${error}`,
        severity: "error" as CustomToastVariant,
      });
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const {name, value} = e.target;
    setproductDetails({...productDetails, [name]: value})
  }

  useEffect(()=>{
    console.log({productDetails})
  }, [productDetails])

  return (
    <Box component={Paper} p={2}>
      <CustomInputField
        fullWidth
        label="Product Name"
        name="name"
        variant="outlined"
        margin="normal"
        value={productDetails?.name}
        onChange={handleChange}
      />

      <CustomInputField
        fullWidth
        label="Product Description"
        name="description"
        variant="outlined"
        margin="normal"
        value={productDetails?.description}
        onChange={handleChange}
      />

      <CustomInputField
        fullWidth
        label="Brand Name"
        name="brand"
        variant="outlined"
        margin="normal"
        value={productDetails?.brand}
        onChange={handleChange}
      />

      <CustomSelect
        label="Category"
        name="category"
        fullWidth
        options={[
          {
            label: 'Top Wear',
            value: 'Top Wear'
          },
          {
            label: 'Bottom Wear',
            value: 'Bottom Wear'
          },
          {
            label: 'Foot Wear',
            value: 'Foot Wear'
          },
          {
            label: 'Acessories',
            value: 'Acessories'
          },
        ]}
        value={productDetails?.category}
        onChange={handleChange}
      />

      <CustomSelect
        label="Gender"
        name="gender"
        fullWidth
        options={[
          {
            label: 'Male',
            value: 'Male'
          },
          {
            label: 'Female',
            value: 'Female'
          },
        ]}
        value={productDetails?.gender}
        onChange={handleChange}
      />

      <CustomSelect
        label="Age Group"
        name="ageGroup"
        fullWidth
        options={[
          {
            label: 'Adults',
            value: 'Adults'
          },
          {
            label: 'Teenagers',
            value: 'Teenagers'
          },
          {
            label: 'Kids',
            value: 'Kids'
          },
        ]}
        value={productDetails?.ageGroup}
        onChange={handleChange}
      />

      <CustomInputField
        fullWidth
        label="Price"
        name="price"
        variant="outlined"
        margin="normal"
        value={productDetails?.price}
        onChange={handleChange}
      />

      <Box aria-label="File upload section">
        <div {...getRootProps()} style={dropzoneStyles as React.CSSProperties}>
          <input {...getInputProps()} />
          <Typography variant="body1">
            Drag 'n' drop the files here, or click to select files
          </Typography>
        </div>

        {files.length > 0 && (
          <div>
            <Typography variant="h6">Selected Files:</Typography>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {files.map((file, index) => (
                <li key={index} style={{ margin: "4px", position: "relative" }}>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file as Blob)}
                      alt={file.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file as Blob)}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                      controls={false}
                    />
                  )}
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: "50%",
                    }}
                    onClick={() => removeFile(index)}
                  >
                    <CloseIcon />
                  </IconButton>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* {uploadedFiles.length > 0 && (
          <div>
            <Typography variant="h6">Uploaded Files:</Typography>
            <ul>
              {uploadedFiles.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
          </div>
        )} */}
      </Box>
      <Button variant="contained" color="primary" onClick={uploadFiles}>
        Upload Product
      </Button>

      <CustomToast toastData={toastData} setToastData={setToastData} />
      {
        loading && <CustomLoader isActive={loading} />
      }
    </Box>
  );
}
