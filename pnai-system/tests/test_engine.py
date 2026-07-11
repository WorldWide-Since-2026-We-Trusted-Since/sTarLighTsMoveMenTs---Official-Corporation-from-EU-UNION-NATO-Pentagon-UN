from pnai.engine.valuation import (
    WonnetParams,
    build_master_token_certificate,
    build_real_economy_anchor,
    compute_density,
    derive_value_per_connection_eur,
)


def test_density_matches_concept_math():
    d = compute_density(WonnetParams())
    # 580 * 33000 * 300 = 5,742,000,000 per wonnet
    assert d.connections_per_wonnet == 5_742_000_000
    # * 130 wonnets = 746,460,000,000
    assert d.total_connections == 746_460_000_000


def test_value_per_connection_from_live_prices():
    prices = {"bitcoin": {"eur": 50000.0}, "ethereum": {"eur": 2000.0}}
    fx = {"USD": 1.1}
    vpc = derive_value_per_connection_eur(prices, fx)
    # mean(50000, 2000) = 26000 ; * 1e-4 = 2.6
    assert abs(vpc["value_per_connection_eur"] - 2.6) < 1e-9
    assert vpc["inputs"]["asset_count"] == 2


def test_value_per_connection_no_prices():
    vpc = derive_value_per_connection_eur({}, {})
    assert vpc["value_per_connection_eur"] == 0.0


def test_certificate_has_proof_and_volume():
    vpc = derive_value_per_connection_eur({"bitcoin": {"eur": 50000.0}}, {})
    cert = build_master_token_certificate(WonnetParams(), vpc)
    assert cert["protocol_meta"]["proof_sha256"]
    assert cert["valuation"]["integrated_volume_eur"] > 0


def test_schleif_fixpoint_converges_from_live_prices():
    from pnai.engine.pixel import pixel_interaction, run_schleif_fixpoint

    prices = {
        "bitcoin": {"eur": 52000.0},
        "ethereum": {"eur": 1380.0},
        "solana": {"eur": 62.0},
        "ripple": {"eur": 0.9},
    }
    fp = run_schleif_fixpoint(prices)
    assert fp["reached_fixpoint"] is True
    assert fp["pixels"] == 4
    assert abs(sum(fp["fixpoint_weights"].values()) - 1.0) < 1e-6

    pe = pixel_interaction(prices, WonnetParams())
    assert pe["variations"]["B_wechselwirkung_hebel"]["hebel_faktor"] >= 1.0
    assert pe["variations"]["A_basis"]["pixel_dichte"] == 746_460_000_000


def test_schleif_fixpoint_handles_no_prices():
    from pnai.engine.pixel import run_schleif_fixpoint

    fp = run_schleif_fixpoint({})
    assert fp["status"] == "no_live_prices"
    assert fp["reached_fixpoint"] is False


def test_real_economy_anchor_sums_live_inputs():
    anchor = build_real_economy_anchor(
        {"total_market_cap_usd": 2_000_000_000_000, "btc_dominance": 55.0,
         "active_cryptocurrencies": 17000},
        {"total_tvl_usd": 70_000_000_000, "protocols_tracked": 7000},
        {"chains_online": 6, "chains_total": 6},
    )
    assert anchor["status"] == "live"
    assert anchor["combined_observed_value_usd"] == 2_070_000_000_000
    assert anchor["chains_online"] == 6
