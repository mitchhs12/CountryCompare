import mongoose, { Schema, model, models } from "mongoose";

export interface CountryDocument extends mongoose.Document {
  id: string; // Our id
  name: string; // Country name
  lowResImage: string; // Low resolution image
  highResImage: string; // High resolution image
  residence: string; // Residence
  currencySymbol: string;
  currencyName: string; // Currency name
  _id: mongoose.Types.ObjectId; // Mongoose's id
}

const CountrySchema = new Schema<CountryDocument>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lowResImage: {
    type: String,
    required: true,
  },
  highResImage: {
    type: String,
    required: true,
  },
  residence: {
    type: String,
    required: true,
  },
  currencySymbol: {
    type: String,
    required: true,
  },
  currencyName: {
    type: String,
    required: true,
  },
});

const Country = models.Country || model<CountryDocument>("Country", CountrySchema);

export default Country;
