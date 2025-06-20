import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import "./PriceSearch.css";

export default function PriceDetail() {
  const { id } = useParams();
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usdToMyrRate, setUsdToMyrRate] = useState(1);

  useEffect(() => {
    // Fetch price data
    axios.get(`/price/price/${id}`)
      .then(res => {
        setPriceData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      }); 

    // Fetch USD→MYR rate
    axios.get("/api/currency/usd-to-myr")
      .then(res => setUsdToMyrRate(res.data.rate))
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="tracker-container"><p>Loading...</p></div>;
  if (!priceData) return <div className="tracker-container"><p>❌ Failed to load price data.</p></div>;

  // Filter offers for major platforms only
  const validPlatforms = ["steam", "epic", "gog", "official store"];
  const offers = priceData.prices.list.filter(offer =>
    offer.edition_full?.toLowerCase().includes("windows") &&        // PC only
    offer.available === true &&                                      // Available listing
    offer.price > 0 &&                                               // Valid price
    // Filter to known platforms
    validPlatforms.some(platform =>
      offer.store.name.toLowerCase().includes(platform) ||
      (offer.store.type && offer.store.type.toLowerCase().includes(platform))
    )
  );

  return (
    <div className="tracker-container">
      <h1 className="tracker-title">{priceData.info.name}</h1>

      <img
        className="price-banner"
        src={priceData.info.banner || priceData.info.cover}
        alt={priceData.info.name}
      />

      <h2 style={{ marginTop: "30px" }}>💰 PC Price Offers</h2>

      {offers.length === 0 && (
        <p style={{ color: "#ccc", marginTop: "20px" }}>
          ⚠ No offers from Steam/Epic/GOG/etc. available for PC at the moment.
        </p>
      )}

      <div className="price-list">
        {offers.map((offer, idx) => (
          <div key={idx} className="price-item">
            <img
              src={offer.store.image}
              alt={offer.store.name}
              className="store-logo"
            />
            <div className="store-details">
              <b>{offer.store.name}</b>
              <span>Region: {offer.region}</span>
              <span className="price">
                RM {(offer.price * 1).toFixed(2)}
              </span>
              <a href={offer.url} target="_blank" rel="noreferrer">
                Go to Store
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
