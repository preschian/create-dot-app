"use client";

// Live demo of read + write paths against the selected Polkadot Hub chain.
//   • Block watcher — new heads via wagmi useBlock
//   • flipper.flip() / system.remark() — contract calls (addresses in lib/contracts/addresses.ts)
import React, { useEffect, useState } from "react";
import {
  useBlock,
  useChains,
  useConnection,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { type BaseError } from "viem";
import type { Tokens } from "./theme";
import { type NetworkInfo, TESTNET, rpcHost, explorerTxUrl } from "./networks";
import { CLI } from "./data";
import { Ic, LiveDot } from "./icons";
import {
  flipperAbi,
  flipperAddressForChain,
  remarkAbi,
  remarkAddressForChain,
} from "../../lib/contracts";

interface Props {
  C: Tokens;
  acc: string;
  mono: string;
  body: string;
  disp: string;
  net: NetworkInfo;
  onSwitch: (chainId: number) => void;
}

type ActionKey = "flip" | "remark";

const STEPS = ["Ready", "Broadcast", "InBlock", "Finalized"];
const trunc = (a: string) => `${a.slice(0, 8)}…${a.slice(-4)}`;
const REMARK_MESSAGE = `gm from ${CLI}`;

export function LiveDemo({ C, acc, mono, body, disp, net, onSwitch }: Props) {
  const chainReady = useChains().some((c) => c.id === net.chainId);
  const { data: head } = useBlock({
    chainId: chainReady ? net.chainId : undefined,
    watch: chainReady,
    query: { enabled: chainReady },
  });
  const block = head?.number ?? null;
  const hash = head?.hash ?? null;
  const reconnecting = !chainReady || block === null;
  const finalized = block !== null ? block - 3n : null;

  const { isConnected } = useWeb3AuthConnect();
  const { connect } = useWeb3AuthConnect();
  const { address } = useConnection();

  const flipperAddress = flipperAddressForChain(net.chainId);
  const remarkAddress = remarkAddressForChain(net.chainId);

  const { data: flipValue, refetch: refetchFlip } = useReadContract({
    address: flipperAddress,
    abi: flipperAbi,
    functionName: "get",
    chainId: net.chainId,
    query: { enabled: Boolean(flipperAddress && chainReady) },
  });

  const { mutate, data: txHash, error: txError, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const ACTIONS = {
    flip: { key: "flip" as ActionKey, tab: "flipper.flip", title: "Call the flipper contract", cta: "Call contract" },
    remark: { key: "remark" as ActionKey, tab: "system.remark", title: "Submit a sample extrinsic", cta: "Send extrinsic" },
  };
  const [actionKey, setActionKey] = useState<ActionKey>("remark");
  const action = ACTIONS[actionKey];

  const contractAddress = actionKey === "flip" ? flipperAddress : remarkAddress;
  const actionBlocked = !contractAddress;
  const actionLabel = actionKey === "flip" ? "flipper.flip" : "system.remark";
  const isTestnet = net.chainId === TESTNET.chainId;

  useEffect(() => {
    reset();
  }, [net.chainId, reset]);

  useEffect(() => {
    if (isConfirmed && actionKey === "flip") {
      void refetchFlip();
    }
  }, [isConfirmed, actionKey, refetchFlip]);

  const stage = isConfirmed ? 3 : txHash ? 2 : isPending ? 1 : -1;
  const pending = isPending || (!!txHash && isConfirming && !isConfirmed);

  const submit = () => {
    if (pending || actionBlocked) return;
    if (!isConnected || !address) {
      connect();
      return;
    }
    reset();

    if (actionKey === "flip" && flipperAddress) {
      mutate({
        address: flipperAddress,
        abi: flipperAbi,
        functionName: "flip",
        chainId: net.chainId,
      });
      return;
    }

    if (actionKey === "remark" && remarkAddress) {
      mutate({
        address: remarkAddress,
        abi: remarkAbi,
        functionName: "remark",
        args: [REMARK_MESSAGE],
        chainId: net.chainId,
      });
    }
  };

  const cell: React.CSSProperties = { padding: "26px 30px" };
  const eyebrow: React.CSSProperties = {
    fontFamily: mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: C.faint,
  };

  const missingContractName = actionKey === "flip" ? "flipper" : "remark";

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${C.line}` }}
      className="ed-live"
    >
      <div className="ed-cell ed-blockcell" style={{ ...cell, borderRight: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={eyebrow}>NETWORK</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: mono,
              fontSize: 11.5,
              color: reconnecting ? C.faint : C.dim,
            }}
          >
            <LiveDot color={reconnecting ? C.faint : net.color} />
            {reconnecting ? "connecting…" : "connected"} · {rpcHost(net.rpc)}
          </span>
        </div>

        <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: mono, fontSize: 15, color: acc, fontWeight: 600 }}>#</span>
          <span
            className="ed-bignum"
            style={{
              fontFamily: mono,
              fontSize: "clamp(36px, 5.2vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: C.ink,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              display: "inline-block",
            }}
          >
            {block !== null
              ? Number(block)
                  .toLocaleString("en-US")
                  .split("")
                  .map((ch, i) => (
                    <span key={i + "-" + ch} style={{ display: "inline-block", animation: "blockBump .45s cubic-bezier(.2,.8,.2,1)" }}>
                      {ch}
                    </span>
                  ))
              : "—"}
          </span>
        </div>
        <div style={{ fontFamily: mono, fontSize: 12, color: C.faint, marginTop: 8 }}>
          {hash ? `${hash.slice(0, 10)}…` : "0x…"} · ~3s block time
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 28, flexWrap: "wrap", rowGap: 14 }}>
          {[
            ["Finalized", finalized !== null ? "#" + Number(finalized).toLocaleString("en-US") : "—"],
            ["Chain", net.chain],
            ["Token", net.token],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: "0.1em", color: C.faint }}>{k.toUpperCase()}</div>
              <div style={{ fontFamily: mono, fontSize: 14, color: C.ink, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={cell} className="ed-cell ed-tx">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={eyebrow}>TRY THE WRITE PATH</span>
          <span style={{ fontFamily: mono, fontSize: 11.5, color: C.faint }}>
            signer: {isConnected && address ? trunc(address) : "//Alice"}
          </span>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignSelf: "flex-start",
            border: `1px solid ${C.line}`,
            padding: 2,
            gap: 2,
          }}
        >
          {Object.values(ACTIONS).map((a) => {
            const on = a.key === actionKey;
            return (
              <button
                key={a.key}
                onClick={() => {
                  if (!pending) {
                    setActionKey(a.key);
                    reset();
                  }
                }}
                style={{
                  fontFamily: mono,
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: "6px 12px",
                  cursor: pending ? "default" : "pointer",
                  border: "none",
                  background: on ? acc : "transparent",
                  color: on ? C.paper : C.dim,
                  opacity: pending && !on ? 0.5 : 1,
                  transition: "background .14s,color .14s",
                }}
              >
                {a.tab}
                {a.key === "flip" ? "()" : ""}
              </button>
            );
          })}
        </div>

        <div style={{ minHeight: 130 }}>
          {actionBlocked ? (
            <div style={{ marginTop: 12, border: `1px dashed ${C.line}`, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.faint, flex: "0 0 auto" }} />
                <div style={{ fontFamily: disp, fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: C.ink }}>
                  No {missingContractName} contract on {net.chain}
                </div>
              </div>
              <p style={{ fontFamily: body, fontSize: 13, lineHeight: 1.5, color: C.dim, margin: "6px 0 0" }}>
                Run{" "}
                <span style={{ fontFamily: mono, fontSize: 12, color: acc }}>
                  cd contracts && npm run deploy
                </span>{" "}
                then set <span style={{ fontFamily: mono, fontSize: 12, color: acc }}>{missingContractName}</span> in{" "}
                <span style={{ fontFamily: mono, fontSize: 12, color: acc }}>lib/contracts/addresses.ts</span> (testnet).
              </p>
              {!isTestnet && (
                <button
                  className="ed-res"
                  onClick={() => onSwitch(TESTNET.chainId)}
                  style={{
                    marginTop: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: mono,
                    fontSize: 12.5,
                    fontWeight: 600,
                    padding: 0,
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    color: acc,
                    whiteSpace: "nowrap",
                  }}
                >
                  Switch to {TESTNET.chain}
                  <Ic.arrow className="ed-ar" style={{ fontSize: 14, transition: "transform .14s" }} />
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                className="ed-txhead"
                style={{ marginTop: 14, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: disp, fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", color: C.ink }}>
                    {action.title}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 12.5, color: C.dim, marginTop: 6 }}>
                    {actionKey === "flip" ? (
                      <>
                        flipper.flip() · value:{" "}
                        <span style={{ color: acc }}>{flipValue === undefined ? "…" : String(flipValue)}</span>
                      </>
                    ) : (
                      <>
                        system.remark(<span style={{ color: acc }}>&quot;{REMARK_MESSAGE}&quot;</span>)
                      </>
                    )}
                  </div>
                </div>
                <button
                  className="ed-btn"
                  onClick={submit}
                  disabled={pending}
                  style={{
                    flex: "0 0 auto",
                    minWidth: 172,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: mono,
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "11px 18px",
                    cursor: pending ? "default" : "pointer",
                    border: `1.5px solid ${acc}`,
                    background: pending ? "transparent" : acc,
                    color: pending ? acc : C.paper,
                    opacity: pending ? 0.7 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {pending ? "Submitting…" : stage === 3 ? "Run again" : !isConnected ? "Connect to send" : action.cta}
                  {!pending && <Ic.arrow style={{ fontSize: 15 }} />}
                </button>
              </div>

              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 0 }}>
                {STEPS.map((labelText, i) => {
                  const active = stage >= i;
                  return (
                    <React.Fragment key={labelText}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span
                          style={{
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            display: "inline-block",
                            flex: "0 0 auto",
                            background: active ? acc : "transparent",
                            border: `1.5px solid ${active ? acc : C.line}`,
                            boxShadow:
                              active && i === stage && pending
                                ? `0 0 0 4px color-mix(in srgb, ${acc} 22%, transparent)`
                                : "none",
                            transition: "all .2s",
                          }}
                        />
                        <span style={{ fontFamily: mono, fontSize: 11.5, color: active ? C.ink : C.faint, transition: "color .2s" }}>
                          {labelText}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            height: 1.5,
                            margin: "0 9px",
                            background: stage > i ? acc : C.line,
                            transition: "background .2s",
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, minHeight: 22, display: "flex", flexDirection: "column", gap: 6 }}>
                {txError ? (
                  <div style={{ fontFamily: mono, fontSize: 12, color: acc }}>
                    {(txError as BaseError).shortMessage || txError.message}
                  </div>
                ) : isConfirmed && txHash ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: mono, fontSize: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: acc, fontWeight: 600 }}>
                      <Ic.check style={{ fontSize: 13 }} /> Finalized
                    </span>
                    <span style={{ color: C.faint }}>{actionLabel}</span>
                    <a
                      className="ed-res"
                      href={explorerTxUrl(net, txHash)}
                      target="_blank"
                      rel="noreferrer"
                      title="View transaction on the block explorer"
                      style={{ color: C.dim, textDecoration: "none" }}
                    >
                      {trunc(txHash)}
                    </a>
                    {receipt && (
                      <span style={{ color: C.faint, marginLeft: "auto" }}>
                        in #{Number(receipt.blockNumber).toLocaleString("en-US")}
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ fontFamily: mono, fontSize: 12, color: C.faint }}>No extrinsics submitted yet.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
