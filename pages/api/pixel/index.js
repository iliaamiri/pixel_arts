import {getAllPixels} from "../../../lib/pixel.service";

export default async function handler(req, res) {
  const pixels = await getAllPixels();
  res.status(200).json(pixels);
}
