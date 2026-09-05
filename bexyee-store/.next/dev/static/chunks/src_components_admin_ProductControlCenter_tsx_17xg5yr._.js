(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/admin/ProductControlCenter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductControlCenter",
    ()=>ProductControlCenter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ProductControlCenter({ initialProduct, auditLogs = [], analyticsData, initialSection = "PRODUCT" }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialSection);
    const [viewport, setViewport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("1440");
    const [statusMessage, setStatusMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmDelete, setConfirmDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleDeleteProduct() {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/products?id=${product.id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                throw new Error(err.error || "Failed to delete product.");
            }
            notify("✓ Product successfully removed from storefront.");
            setTimeout(()=>{
                router.push("/admin");
            }, 800);
        } catch (e) {
            notify(e instanceof Error ? e.message : "Error deleting product.", "error");
        } finally{
            setIsSaving(false);
            setConfirmDelete(false);
        }
    }
    // Section 1: Product Form State
    const [formState, setFormState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: initialProduct.name,
        slug: initialProduct.slug,
        sku: initialProduct.sku,
        cityName: initialProduct.cityName,
        collection: initialProduct.collection,
        edition: initialProduct.edition,
        pricePaise: initialProduct.pricePaise,
        compareAtPricePaise: initialProduct.compareAtPricePaise,
        gstRate: initialProduct.gstRate,
        description: initialProduct.description,
        fabric: initialProduct.fabric,
        gsm: initialProduct.gsm,
        fit: initialProduct.fit,
        careInstructions: initialProduct.careInstructions || "",
        seoTitle: initialProduct.seoTitle,
        seoDescription: initialProduct.seoDescription
    });
    // Section 2: Inventory Adjust Modal State
    const [adjustModal, setAdjustModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        size: "M",
        mode: "SET",
        amount: "",
        reason: "Standard inventory audit"
    });
    // Section 3: Assets State
    const [assetSlots, setAssetSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.assets);
    // Section 4: Movable Background State & Modes
    const [bgType, setBgType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.assets.backgroundType || "DEFAULT_STUDIO");
    const [bgDesktop, setBgDesktop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.assets.backgrounds.desktop || "");
    const [bgTablet, setBgTablet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.assets.backgrounds.tablet || "");
    const [bgMobile, setBgMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.assets.backgrounds.mobile || "");
    // Section 5: Launch & Purchase Mode State
    const [launchStatus, setLaunchStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.launch.status);
    const [purchaseMode, setPurchaseMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.launch.purchaseMode || "BUY_NOW");
    const [prebookStart, setPrebookStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.launch.prebookStartsAt || "");
    const [prebookEnd, setPrebookEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.launch.prebookEndsAt || "");
    const [fulfillmentEstimate, setFulfillmentEstimate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialProduct.launch.fulfillmentEstimate || "OCTOBER 2026");
    const [sizePrebookLimits, setSizePrebookLimits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ProductControlCenter.useState": ()=>{
            const map = {
                S: 20,
                M: 50,
                L: 30,
                XL: 20
            };
            (initialProduct.variants || []).forEach({
                "ProductControlCenter.useState": (v)=>{
                    if (v.size && v.size in map) {
                        map[v.size] = typeof v.prebookLimit === "number" ? v.prebookLimit : v.size === "M" ? 50 : v.size === "L" ? 30 : 20;
                    }
                }
            }["ProductControlCenter.useState"]);
            if (initialProduct.prebookConfig?.sizeLimits) {
                return {
                    ...map,
                    ...initialProduct.prebookConfig.sizeLimits
                };
            }
            return map;
        }
    }["ProductControlCenter.useState"]);
    function notify(text, type = "success") {
        setStatusMessage({
            type,
            text
        });
        setTimeout(()=>setStatusMessage(null), 4000);
    }
    // 1. SAVE PRODUCT DETAILS
    async function handleSaveProduct() {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: product.id,
                    name: formState.name,
                    slug: formState.slug,
                    sku: formState.sku,
                    cityName: formState.cityName,
                    collection: formState.collection,
                    edition: formState.edition,
                    price: formState.pricePaise / 100,
                    compareAtPrice: formState.compareAtPricePaise ? formState.compareAtPricePaise / 100 : null,
                    gstRate: formState.gstRate,
                    description: formState.description,
                    fabric: formState.fabric,
                    gsm: formState.gsm,
                    fit: formState.fit,
                    careInstructions: formState.careInstructions,
                    seoTitle: formState.seoTitle,
                    seoDescription: formState.seoDescription
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to persist product updates.");
            }
            setProduct((prev)=>({
                    ...prev,
                    ...formState
                }));
            notify("✓ Product identity, pricing, and SEO persisted to database.");
        } catch (e) {
            notify(e instanceof Error ? e.message : "Error updating product.", "error");
        } finally{
            setIsSaving(false);
        }
    }
    // 1b. SAVE ASSETS & 3D GLB
    async function handleSaveAssets() {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: product.id,
                    modelUrl: assetSlots.modelUrl || null,
                    frontImageUrl: assetSlots.frontImage,
                    backImageUrl: assetSlots.backImage,
                    leftSleeveImageUrl: assetSlots.leftSleeveImage,
                    rightSleeveImageUrl: assetSlots.rightSleeveImage,
                    printImageUrl: assetSlots.printImage
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to persist asset configuration.");
            }
            setProduct((prev)=>({
                    ...prev,
                    assets: {
                        ...prev.assets,
                        ...assetSlots
                    }
                }));
            notify("✓ Visual assets and 3D GLB configuration persisted to database.");
        } catch (e) {
            notify(e instanceof Error ? e.message : "Error saving assets.", "error");
        } finally{
            setIsSaving(false);
        }
    }
    // 1c. SAVE BACKGROUND ENVIRONMENT
    async function handleSaveBackgrounds() {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: product.id,
                    backgroundType: bgType,
                    backgroundDesktop: bgType === "PRODUCT_SPECIFIC" ? bgDesktop || null : null,
                    backgroundTablet: bgType === "PRODUCT_SPECIFIC" ? bgTablet || null : null,
                    backgroundMobile: bgType === "PRODUCT_SPECIFIC" ? bgMobile || null : null
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to persist background environment.");
            }
            setProduct((prev)=>({
                    ...prev,
                    assets: {
                        ...prev.assets,
                        backgroundType: bgType,
                        backgrounds: {
                            desktop: bgType === "NONE" ? "" : bgType === "PRODUCT_SPECIFIC" ? bgDesktop : bgType === "COLLECTION" ? product.cityName === "BENGALURU" ? "/bengaluru-signal-after-rain.svg" : "/assets/environments/bexyee-studio-neutral.svg" : "/assets/environments/bexyee-studio-neutral.svg",
                            tablet: bgType === "NONE" ? "" : bgType === "PRODUCT_SPECIFIC" ? bgTablet || bgDesktop : "/assets/environments/bexyee-studio-neutral.svg",
                            mobile: bgType === "NONE" ? "" : bgType === "PRODUCT_SPECIFIC" ? bgMobile || bgDesktop : "/assets/environments/bexyee-studio-neutral.svg"
                        }
                    }
                }));
            notify("✓ Product visual environment configuration persisted to database.");
        } catch (e) {
            notify(e instanceof Error ? e.message : "Error saving background environment.", "error");
        } finally{
            setIsSaving(false);
        }
    }
    // 2. INVENTORY ADJUSTMENT ACTION
    async function handleExecuteInventoryAdjustment() {
        const val = parseInt(adjustModal.amount);
        if (isNaN(val) || val <= 0) {
            notify("Please enter a valid stock quantity amount.", "error");
            return;
        }
        if (!adjustModal.reason.trim()) {
            notify("Adjustment reason is mandatory for audit trail compliance.", "error");
            return;
        }
        const currentVariant = product.variants.find((v)=>v.size === adjustModal.size);
        const currentPhysical = currentVariant?.physicalStock ?? 0;
        let delta = 0;
        if (adjustModal.mode === "SET") {
            delta = val - currentPhysical;
        } else if (adjustModal.mode === "ADD") {
            delta = val;
        } else if (adjustModal.mode === "REMOVE") {
            delta = -val;
        }
        if (delta === 0) {
            notify("Stock quantity remains unchanged (delta = 0).", "error");
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: product.id,
                    size: adjustModal.size,
                    delta,
                    reason: adjustModal.reason.trim()
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Inventory adjustment failed.");
            }
            // Update local matrix
            setProduct((prev)=>{
                const updatedVariants = prev.variants.map((v)=>{
                    if (v.size === adjustModal.size) {
                        const nextPhysical = Math.max(0, v.physicalStock + delta);
                        const nextAvail = Math.max(0, nextPhysical - v.reservedStock);
                        const nextStatus = nextPhysical === 0 || nextAvail === 0 ? "SOLD OUT" : nextAvail <= v.threshold ? "LOW" : "ACTIVE";
                        return {
                            ...v,
                            physicalStock: nextPhysical,
                            availableStock: nextAvail,
                            status: nextStatus
                        };
                    }
                    return v;
                });
                const totalAvail = updatedVariants.reduce((acc, v)=>acc + v.availableStock, 0);
                return {
                    ...prev,
                    variants: updatedVariants,
                    totalAvailableStock: totalAvail,
                    isSoldOut: totalAvail === 0
                };
            });
            setAdjustModal((prev)=>({
                    ...prev,
                    isOpen: false,
                    amount: ""
                }));
            notify(`✓ Stock for size ${adjustModal.size} adjusted by ${delta > 0 ? "+" : ""}${delta} units.`);
        } catch (e) {
            notify(e instanceof Error ? e.message : "Adjustment error.", "error");
        } finally{
            setIsSaving(false);
        }
    }
    // 4. LAUNCH & PURCHASE MODE ACTION
    async function handleSaveLaunchAndPurchaseMode(newStatus) {
        const targetStatus = newStatus || launchStatus;
        setIsSaving(true);
        const totalLimit = (sizePrebookLimits.S || 0) + (sizePrebookLimits.M || 0) + (sizePrebookLimits.L || 0) + (sizePrebookLimits.XL || 0);
        try {
            const res = await fetch("/api/admin/products", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: product.id,
                    status: targetStatus,
                    purchaseMode,
                    isPrebook: purchaseMode === "PREBOOK",
                    prebookStartsAt: prebookStart ? new Date(prebookStart).toISOString() : null,
                    prebookEndsAt: prebookEnd ? new Date(prebookEnd).toISOString() : null,
                    expectedFulfillmentDate: fulfillmentEstimate,
                    sizePrebookLimits,
                    prebookLimit: totalLimit
                })
            });
            const data = await res.json().catch(()=>({}));
            if (!res.ok) {
                throw new Error(data.error || "Failed to update launch and purchase mode.");
            }
            setLaunchStatus(targetStatus);
            setProduct((prev)=>{
                const updatedVariants = prev.variants.map((v)=>{
                    const limit = sizePrebookLimits[v.size] ?? v.prebookLimit ?? 50;
                    const prebooked = v.prebookedCount ?? 0;
                    const availablePrebook = Math.max(0, limit - prebooked);
                    return {
                        ...v,
                        prebookLimit: limit,
                        availablePrebook,
                        availableStock: purchaseMode === "PREBOOK" ? availablePrebook : v.availableStock,
                        status: purchaseMode === "PREBOOK" ? availablePrebook === 0 ? "SOLD OUT" : availablePrebook <= v.threshold ? "LOW" : "ACTIVE" : v.status
                    };
                });
                const totalAvailable = updatedVariants.reduce((acc, v)=>acc + v.availableStock, 0);
                return {
                    ...prev,
                    variants: updatedVariants,
                    totalAvailableStock: totalAvailable,
                    isSoldOut: totalAvailable <= 0,
                    launch: {
                        ...prev.launch,
                        status: targetStatus,
                        purchaseMode,
                        prebookStartsAt: prebookStart || undefined,
                        prebookEndsAt: prebookEnd || undefined,
                        fulfillmentEstimate,
                        prebookQuantityLimit: totalLimit,
                        isPurchasable: targetStatus === "LIVE" && (purchaseMode === "PREBOOK" || totalAvailable > 0)
                    },
                    prebookConfig: purchaseMode === "PREBOOK" ? {
                        isEnabled: true,
                        startsAt: prebookStart || undefined,
                        endsAt: prebookEnd || undefined,
                        expectedFulfillmentDate: fulfillmentEstimate,
                        sizeLimits: sizePrebookLimits,
                        prebookLimit: totalLimit
                    } : undefined
                };
            });
            notify(`✓ Launch state updated to ${targetStatus} (${purchaseMode}).`);
        } catch (e) {
            notify(e instanceof Error ? e.message : "Error updating launch status.", "error");
        } finally{
            setIsSaving(false);
        }
    }
    const isLive = launchStatus === "LIVE";
    const isPaused = launchStatus === "PAUSED";
    const viewButtonLabel = isLive || isPaused ? "VIEW STOREFRONT ↗" : "VIEW PREVIEW ↗";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-control-center",
        style: {
            minHeight: "100vh",
            background: "#F7F7F3",
            color: "#000000",
            fontFamily: "var(--font-space-mono), monospace"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    background: "#FFFFFF",
                    borderBottom: "1px solid #E5E5E5",
                    padding: "24px clamp(20px, 4vw, 48px)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        maxWidth: "1360px",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "16px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "10px",
                                        color: "#777777",
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/admin",
                                            style: {
                                                color: "#000000",
                                                textDecoration: "none",
                                                fontWeight: 700
                                            },
                                            children: "BEXYEE"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 446,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "/"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 447,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "PRODUCTS"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 448,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "/"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 449,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            style: {
                                                color: "#000000"
                                            },
                                            children: product.sku
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 450,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 445,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    style: {
                                        margin: "6px 0 0",
                                        fontSize: "24px",
                                        fontWeight: 900,
                                        letterSpacing: "-0.04em"
                                    },
                                    children: product.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 452,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 444,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                flexWrap: "wrap"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: "10px",
                                        fontWeight: 800,
                                        padding: "6px 12px",
                                        background: isLive ? "#000000" : isPaused ? "#FFFBEB" : "#F7F7F3",
                                        color: isLive ? "#FFFFFF" : isPaused ? "#B45309" : "#555555",
                                        border: isPaused ? "1px solid #FCD34D" : "1px solid #E5E5E5"
                                    },
                                    children: [
                                        "STATE: ",
                                        launchStatus,
                                        " ",
                                        isLive || isPaused ? `(${purchaseMode})` : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 459,
                                    columnNumber: 13
                                }, this),
                                isLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSaveLaunchAndPurchaseMode("PAUSED"),
                                    disabled: isSaving,
                                    style: {
                                        background: "#FFFFFF",
                                        border: "1px solid #E5E5E5",
                                        color: "#E52B20",
                                        padding: "8px 14px",
                                        fontSize: "10.5px",
                                        fontWeight: 700,
                                        cursor: "pointer"
                                    },
                                    children: "PAUSE LAUNCH"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 473,
                                    columnNumber: 15
                                }, this) : isPaused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSaveLaunchAndPurchaseMode("LIVE"),
                                    disabled: isSaving,
                                    style: {
                                        background: "#000000",
                                        border: "1px solid #000000",
                                        color: "#FFFFFF",
                                        padding: "8px 16px",
                                        fontSize: "10.5px",
                                        fontWeight: 800,
                                        cursor: "pointer"
                                    },
                                    children: "RESUME LAUNCH ↗"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 482,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSaveLaunchAndPurchaseMode("LIVE"),
                                    disabled: isSaving,
                                    style: {
                                        background: "#000000",
                                        border: "1px solid #000000",
                                        color: "#FFFFFF",
                                        padding: "8px 16px",
                                        fontSize: "10.5px",
                                        fontWeight: 800,
                                        cursor: "pointer"
                                    },
                                    children: "PUBLISH LIVE ↗"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 491,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/product/${product.slug}`,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    style: {
                                        background: "#FFFFFF",
                                        border: "1px solid #000000",
                                        color: "#000000",
                                        padding: "8px 14px",
                                        fontSize: "10.5px",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        display: "inline-block"
                                    },
                                    children: viewButtonLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 501,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    id: "pcc-delete-product-btn",
                                    onClick: ()=>setConfirmDelete(true),
                                    style: {
                                        background: "#FFF1F0",
                                        border: "1px solid #FFA39E",
                                        color: "#E52B20",
                                        padding: "8px 14px",
                                        fontSize: "10.5px",
                                        fontWeight: 800,
                                        cursor: "pointer"
                                    },
                                    title: "Delete or safely archive product",
                                    children: "DELETE ✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 519,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 458,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                    lineNumber: 443,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                lineNumber: 442,
                columnNumber: 7
            }, this),
            confirmDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "dialog",
                "aria-modal": "true",
                style: {
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "20px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "#FFFFFF",
                        border: "2px solid #E52B20",
                        maxWidth: "500px",
                        width: "100%",
                        padding: "32px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: "10px",
                                color: "#E52B20",
                                letterSpacing: "0.14em",
                                fontWeight: 800
                            },
                            children: "DANGER // PERMANENT ACTION"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 566,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                fontSize: "20px",
                                color: "#000000",
                                margin: "8px 0 12px 0"
                            },
                            children: [
                                "Delete ",
                                product.name,
                                "?"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 569,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: "12.5px",
                                color: "#444444",
                                lineHeight: 1.6,
                                margin: "0 0 16px 0"
                            },
                            children: "This product will be removed from the active catalog and immediately hidden across all customer storefront pages."
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: "11px",
                                color: "#777777",
                                background: "#F7F7F3",
                                padding: "10px 14px",
                                border: "1px solid #E5E5E5",
                                margin: "0 0 24px 0"
                            },
                            children: [
                                "ℹ If customer orders exist for this product, it will be automatically archived to preserve financial records with ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "zero storefront visibility"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 576,
                                    columnNumber: 129
                                }, this),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 575,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    id: "cancel-pcc-delete-btn",
                                    onClick: ()=>setConfirmDelete(false),
                                    style: {
                                        background: "#FFFFFF",
                                        border: "1px solid #E5E5E5",
                                        color: "#000000",
                                        padding: "10px 18px",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        cursor: "pointer"
                                    },
                                    children: "CANCEL"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 579,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    id: "confirm-pcc-delete-btn",
                                    onClick: handleDeleteProduct,
                                    disabled: isSaving,
                                    style: {
                                        background: "#E52B20",
                                        border: "1px solid #E52B20",
                                        color: "#FFFFFF",
                                        padding: "10px 22px",
                                        fontSize: "11px",
                                        fontWeight: 800,
                                        cursor: "pointer"
                                    },
                                    children: isSaving ? "DELETING..." : "PERMANENTLY DELETE"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 595,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 578,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                    lineNumber: 556,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                lineNumber: 542,
                columnNumber: 9
            }, this),
            statusMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "status",
                style: {
                    position: "fixed",
                    top: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: statusMessage.type === "success" ? "#000000" : "#DC2626",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    zIndex: 1000,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
                },
                children: statusMessage.text
            }, void 0, false, {
                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                lineNumber: 619,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "#FFFFFF",
                    borderBottom: "1px solid #E5E5E5"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        maxWidth: "1360px",
                        margin: "0 auto",
                        display: "flex",
                        overflowX: "auto",
                        padding: "0 clamp(20px, 4vw, 48px)"
                    },
                    children: [
                        {
                            id: "PRODUCT",
                            label: "1. Product Identity"
                        },
                        {
                            id: "INVENTORY",
                            label: "2. Inventory Matrix"
                        },
                        {
                            id: "ASSETS",
                            label: "3. Assets & 3D GLB"
                        },
                        {
                            id: "BACKGROUND",
                            label: "4. Movable Background"
                        },
                        {
                            id: "LAUNCH",
                            label: "5. Launch & Purchase Mode"
                        },
                        {
                            id: "PREVIEW",
                            label: "6. Multi-Device Preview"
                        },
                        {
                            id: "PERFORMANCE",
                            label: "7. Performance"
                        },
                        {
                            id: "ACTIVITY",
                            label: "8. Activity Log"
                        }
                    ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: `tab-btn-${tab.id.toLowerCase()}`,
                            "data-testid": `tab-${tab.id.toLowerCase()}`,
                            "data-tab-id": tab.id,
                            type: "button",
                            onClick: ()=>{
                                console.log("SWITCHING TO TAB:", tab.id);
                                setActiveTab(tab.id);
                            },
                            style: {
                                background: "transparent",
                                border: "0",
                                borderBottom: activeTab === tab.id ? "3px solid #000000" : "3px solid transparent",
                                color: activeTab === tab.id ? "#000000" : "#777777",
                                padding: "16px 20px",
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.15s ease"
                            },
                            children: tab.label
                        }, tab.id, false, {
                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                            lineNumber: 652,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                    lineNumber: 641,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                lineNumber: 640,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    maxWidth: "1360px",
                    margin: "0 auto",
                    padding: "36px clamp(20px, 4vw, 48px) 80px"
                },
                children: [
                    activeTab === "PRODUCT" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "9.5px",
                                            color: "#777777",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "SECTION 01 // IDENTITY & COMMERCIALS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 688,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            margin: "4px 0 0",
                                            fontSize: "18px"
                                        },
                                        children: "Master Product Attributes"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 689,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 687,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: "20px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Product Name",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.name,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        name: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 695,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 693,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "URL Slug",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.slug,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        slug: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 705,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 703,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Master SKU",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.sku,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        sku: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 715,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 713,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "City Designation",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.cityName,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        cityName: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 725,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 723,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Collection / Capsule",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.collection,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        collection: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 735,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 733,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Edition Batch Tag",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.edition,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        edition: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 745,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 743,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 692,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "20px",
                                    borderTop: "1px solid #F0F0EE",
                                    paddingTop: "20px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Retail Price (₹ INR)",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: formState.pricePaise / 100,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        pricePaise: (parseFloat(e.target.value) || 0) * 100
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 758,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 756,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Compare-at Price (₹ INR)",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: formState.compareAtPricePaise ? formState.compareAtPricePaise / 100 : "",
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        compareAtPricePaise: e.target.value ? (parseFloat(e.target.value) || 0) * 100 : null
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 768,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 766,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Apparel GST Rate %",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: formState.gstRate,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        gstRate: parseInt(e.target.value) || 12
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit",
                                                    background: "#FFFFFF"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "12",
                                                        children: "12% (Standard Apparel GST)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 783,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "5",
                                                        children: "5% (Sub-₹1000 items)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 784,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "18",
                                                        children: "18% (Technical Apparel)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 785,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 778,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 776,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 755,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "20px",
                                    borderTop: "1px solid #F0F0EE",
                                    paddingTop: "20px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Fabric Construction",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.fabric,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        fabric: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 794,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 792,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Density (GSM)",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: formState.gsm || 320,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        gsm: parseInt(e.target.value) || 320
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 804,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 802,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "6px",
                                            fontSize: "11px",
                                            fontWeight: 700
                                        },
                                        children: [
                                            "Silhouette Fit",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formState.fit,
                                                onChange: (e)=>setFormState({
                                                        ...formState,
                                                        fit: e.target.value
                                                    }),
                                                style: {
                                                    padding: "10px",
                                                    border: "1px solid #E5E5E5",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 814,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 812,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 791,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "grid",
                                    gap: "6px",
                                    fontSize: "11px",
                                    fontWeight: 700
                                },
                                children: [
                                    "Editorial Description",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        rows: 3,
                                        value: formState.description,
                                        onChange: (e)=>setFormState({
                                                ...formState,
                                                description: e.target.value
                                            }),
                                        style: {
                                            padding: "12px",
                                            border: "1px solid #E5E5E5",
                                            fontFamily: "inherit",
                                            fontSize: "12px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 825,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 823,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: "12px",
                                    borderTop: "1px solid #F0F0EE",
                                    paddingTop: "20px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleSaveProduct,
                                    disabled: isSaving,
                                    style: {
                                        background: "#000000",
                                        color: "#FFFFFF",
                                        border: "1px solid #000000",
                                        padding: "12px 24px",
                                        fontSize: "11px",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                        letterSpacing: "0.08em"
                                    },
                                    children: isSaving ? "PERSISTING..." : "SAVE & PERSIST TO DATABASE ↗"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 835,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 834,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 686,
                        columnNumber: 11
                    }, this),
                    activeTab === "INVENTORY" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "9.5px",
                                            color: "#777777",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "SECTION 02 // INVENTORY SYSTEM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 860,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            margin: "4px 0 0",
                                            fontSize: "18px"
                                        },
                                        children: "Live Stock Breakdown & Adjustment Engine"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 861,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: "12px",
                                            color: "#666666",
                                            margin: "4px 0 0"
                                        },
                                        children: [
                                            "Formula Invariant: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "Available = Physical Stock - Active Reserved Stock"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 863,
                                                columnNumber: 36
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 862,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 859,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    overflowX: "auto",
                                    border: "1px solid #E5E5E5"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    style: {
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontSize: "12px",
                                        textAlign: "left"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    background: "#F7F7F3",
                                                    borderBottom: "1px solid #E5E5E5"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "12px 16px",
                                                            fontSize: "10px",
                                                            color: "#777777"
                                                        },
                                                        children: "SIZE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 872,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "12px 16px",
                                                            fontSize: "10px",
                                                            color: "#777777"
                                                        },
                                                        children: "PHYSICAL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 873,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "12px 16px",
                                                            fontSize: "10px",
                                                            color: "#777777"
                                                        },
                                                        children: "RESERVED"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 874,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "12px 16px",
                                                            fontSize: "10px",
                                                            color: "#777777"
                                                        },
                                                        children: "AVAILABLE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 875,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "12px 16px",
                                                            fontSize: "10px",
                                                            color: "#777777"
                                                        },
                                                        children: "STATUS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 876,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "12px 16px",
                                                            fontSize: "10px",
                                                            color: "#777777",
                                                            textAlign: "right"
                                                        },
                                                        children: "ACTIONS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 877,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 871,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 870,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: product.variants.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        borderBottom: "1px solid #F0F0EE"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "14px 16px",
                                                                fontWeight: 800
                                                            },
                                                            children: v.size
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 883,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "14px 16px"
                                                            },
                                                            children: [
                                                                v.physicalStock,
                                                                " units"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 884,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "14px 16px",
                                                                color: "#777777"
                                                            },
                                                            children: [
                                                                v.reservedStock,
                                                                " holds"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 885,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "14px 16px",
                                                                fontWeight: 800,
                                                                color: v.availableStock <= 3 ? "#E52B20" : "#000000"
                                                            },
                                                            children: [
                                                                v.availableStock,
                                                                " units"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 886,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "14px 16px"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "9px",
                                                                    fontWeight: 700,
                                                                    padding: "3px 6px",
                                                                    background: v.status === "ACTIVE" ? "#EBFDF2" : v.status === "LOW" ? "#FEF3C7" : "#F3F4F6",
                                                                    color: v.status === "ACTIVE" ? "#15803D" : v.status === "LOW" ? "#D97706" : "#4B5563"
                                                                },
                                                                children: v.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 890,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 889,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "14px 16px",
                                                                textAlign: "right"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setAdjustModal({
                                                                        isOpen: true,
                                                                        size: v.size,
                                                                        mode: "SET",
                                                                        amount: String(v.physicalStock),
                                                                        reason: "Stock recount"
                                                                    }),
                                                                style: {
                                                                    background: "#FFFFFF",
                                                                    border: "1px solid #000000",
                                                                    color: "#000000",
                                                                    padding: "6px 12px",
                                                                    fontSize: "10px",
                                                                    fontWeight: 700,
                                                                    cursor: "pointer"
                                                                },
                                                                children: "ADJUST ✎"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 903,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 902,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, v.size, true, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 882,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 880,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 869,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 868,
                                columnNumber: 13
                            }, this),
                            adjustModal.isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#F7F7F3",
                                    border: "1px solid #000000",
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: "12px",
                                                    letterSpacing: "0.06em"
                                                },
                                                children: [
                                                    "INVENTORY ADJUSTMENT: SIZE ",
                                                    adjustModal.size
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 929,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setAdjustModal({
                                                        ...adjustModal,
                                                        isOpen: false
                                                    }),
                                                style: {
                                                    background: "transparent",
                                                    border: "0",
                                                    cursor: "pointer",
                                                    fontWeight: 700
                                                },
                                                children: "✕ CLOSE"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 932,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 928,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                            gap: "14px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "grid",
                                                    gap: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    "Adjustment Mode",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: adjustModal.mode,
                                                        onChange: (e)=>setAdjustModal({
                                                                ...adjustModal,
                                                                mode: e.target.value
                                                            }),
                                                        style: {
                                                            padding: "8px",
                                                            border: "1px solid #E5E5E5",
                                                            background: "#FFFFFF"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "SET",
                                                                children: "SET EXACT STOCK"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 949,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "ADD",
                                                                children: "ADD UNITS (+)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 950,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "REMOVE",
                                                                children: "REMOVE UNITS (-)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 951,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 944,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 942,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "grid",
                                                    gap: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    "Quantity Amount",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        min: 0,
                                                        value: adjustModal.amount,
                                                        onChange: (e)=>setAdjustModal({
                                                                ...adjustModal,
                                                                amount: e.target.value
                                                            }),
                                                        style: {
                                                            padding: "8px",
                                                            border: "1px solid #E5E5E5"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 957,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 955,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "grid",
                                                    gap: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    "Mandatory Audit Reason",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "e.g. Warehouse batch count verification",
                                                        value: adjustModal.reason,
                                                        onChange: (e)=>setAdjustModal({
                                                                ...adjustModal,
                                                                reason: e.target.value
                                                            }),
                                                        style: {
                                                            padding: "8px",
                                                            border: "1px solid #E5E5E5"
                                                        },
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 968,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 966,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 941,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "10px"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleExecuteInventoryAdjustment,
                                            disabled: isSaving,
                                            style: {
                                                background: "#000000",
                                                color: "#FFFFFF",
                                                border: "1px solid #000000",
                                                padding: "10px 18px",
                                                fontSize: "11px",
                                                fontWeight: 800,
                                                cursor: "pointer"
                                            },
                                            children: "CONFIRM & RECORD AUDIT ENTRY ↗"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 980,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 979,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 927,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 858,
                        columnNumber: 11
                    }, this),
                    activeTab === "ASSETS" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "9.5px",
                                            color: "#777777",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "SECTION 03 // VISUAL ASSETS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1006,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            margin: "4px 0 0",
                                            fontSize: "18px"
                                        },
                                        children: "2D Photographic Views & 3D Garment Models"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1005,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                    gap: "20px"
                                },
                                children: [
                                    [
                                        {
                                            slot: "FRONT",
                                            label: "Front View",
                                            url: assetSlots.frontImage
                                        },
                                        {
                                            slot: "BACK",
                                            label: "Back View",
                                            url: assetSlots.backImage
                                        },
                                        {
                                            slot: "LEFT SLEEVE",
                                            label: "Left Sleeve",
                                            url: assetSlots.leftSleeveImage
                                        },
                                        {
                                            slot: "RIGHT SLEEVE",
                                            label: "Right Sleeve",
                                            url: assetSlots.rightSleeveImage
                                        },
                                        {
                                            slot: "PRINT",
                                            label: "Graphic Print Detail",
                                            url: assetSlots.printImage
                                        }
                                    ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                border: "1px solid #E5E5E5",
                                                padding: "16px",
                                                background: "#F7F7F3"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "8px",
                                                        fontSize: "10px",
                                                        fontWeight: 800
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: item.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1020,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: "#16A34A"
                                                            },
                                                            children: "ACTIVE v1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1021,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1019,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        height: "140px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: "#FFFFFF",
                                                        border: "1px solid #E5E5E5",
                                                        marginBottom: "10px"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: item.url,
                                                        alt: item.label,
                                                        width: 100,
                                                        height: 100,
                                                        style: {
                                                            objectFit: "contain"
                                                        },
                                                        unoptimized: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1024,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1023,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: "10px",
                                                        color: "#777777",
                                                        wordBreak: "break-all"
                                                    },
                                                    children: item.url
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1026,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, item.slot, true, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 1018,
                                            columnNumber: 17
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #E5E5E5",
                                            padding: "16px",
                                            background: "#F7F7F3",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            marginBottom: "8px",
                                                            fontSize: "10px",
                                                            fontWeight: 800
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "HERO 3D GLB MODEL"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1034,
                                                                columnNumber: 21
                                                            }, this),
                                                            assetSlots.modelUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: "#16A34A"
                                                                },
                                                                children: "ACTIVE 3D"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1035,
                                                                columnNumber: 44
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: "#E52B20"
                                                                },
                                                                children: "NOT UPLOADED"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1035,
                                                                columnNumber: 98
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1033,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            height: "140px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            background: "#FFFFFF",
                                                            border: "1px dashed #CCCCCC",
                                                            marginBottom: "10px",
                                                            padding: "16px",
                                                            textAlign: "center"
                                                        },
                                                        children: assetSlots.modelUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "11px",
                                                                fontWeight: 700
                                                            },
                                                            children: "✓ GLB Model Attached"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1039,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: "11px",
                                                                color: "#777777"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "3D ASSET NOT UPLOADED"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                    lineNumber: 1042,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        margin: "4px 0 0",
                                                                        fontSize: "9.5px"
                                                                    },
                                                                    children: "Storefront gracefully renders high-res photography until GLB is supplied."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                    lineNumber: 1043,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1041,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1037,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1032,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "GLB Asset URL (e.g. /models/tee.glb)",
                                                value: assetSlots.modelUrl || "",
                                                onChange: (e)=>setAssetSlots({
                                                        ...assetSlots,
                                                        modelUrl: e.target.value
                                                    }),
                                                style: {
                                                    padding: "8px",
                                                    border: "1px solid #E5E5E5",
                                                    fontSize: "11px",
                                                    fontFamily: "inherit"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1049,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1031,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1010,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleSaveAssets,
                                disabled: isSaving,
                                style: {
                                    alignSelf: "flex-start",
                                    background: "#000000",
                                    color: "#FFFFFF",
                                    border: "1px solid #000000",
                                    padding: "12px 24px",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    cursor: "pointer"
                                },
                                children: "SAVE ASSETS & 3D MODEL ↗"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1059,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 1004,
                        columnNumber: 11
                    }, this),
                    activeTab === "BACKGROUND" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "9.5px",
                                            color: "#777777",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "SECTION 04 // VISUAL ENVIRONMENT"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1083,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            margin: "4px 0 0",
                                            fontSize: "18px"
                                        },
                                        children: "Product Visual Environment & Background Architecture"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1084,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: "12px",
                                            color: "#666666",
                                            margin: "4px 0 0"
                                        },
                                        children: "Every product controls its own independent backdrop. The global brand fallback is neutral BEXYEE studio."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1085,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1082,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: "14px"
                                },
                                children: [
                                    {
                                        id: "DEFAULT_STUDIO",
                                        title: "A. DEFAULT BEXYEE STUDIO",
                                        desc: "Neutral obsidian architectural studio grid with subtle ambient light. Recommended default for all standard products.",
                                        badge: "BRAND DEFAULT"
                                    },
                                    {
                                        id: "COLLECTION",
                                        title: "B. COLLECTION ENVIRONMENT",
                                        desc: `Inherits contextual backdrop of collection (${formState.collection || "Assigned Capsule"})${formState.cityName === "BENGALURU" ? " — Bengaluru Rain Signal" : ""}.`,
                                        badge: formState.cityName === "BENGALURU" ? "BENGALURU EDITION" : "COLLECTION"
                                    },
                                    {
                                        id: "PRODUCT_SPECIFIC",
                                        title: "C. PRODUCT-SPECIFIC",
                                        desc: "Independent custom multi-breakpoint URLs (Desktop 1440px+, Tablet 768px, Mobile 375px) exclusive to this product.",
                                        badge: "CUSTOM ASSET"
                                    },
                                    {
                                        id: "NONE",
                                        title: "D. NO BACKGROUND / CLEAN",
                                        desc: "Pure darkroom minimal studio canvas with zero image overlays. Fastest performance and maximum garment focus.",
                                        badge: "MINIMAL CANVAS"
                                    }
                                ].map((mode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>setBgType(mode.id),
                                        style: {
                                            border: bgType === mode.id ? "2px solid #000000" : "1px solid #E5E5E5",
                                            background: bgType === mode.id ? "#F7F7F3" : "#FFFFFF",
                                            padding: "16px",
                                            cursor: "pointer",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            transition: "all 0.15s ease"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            marginBottom: "8px"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                style: {
                                                                    fontSize: "11px",
                                                                    letterSpacing: "0.04em"
                                                                },
                                                                children: mode.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1134,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "9px",
                                                                    background: bgType === mode.id ? "#000000" : "#EAEAE8",
                                                                    color: bgType === mode.id ? "#FFFFFF" : "#666666",
                                                                    padding: "2px 6px",
                                                                    fontWeight: 700
                                                                },
                                                                children: mode.badge
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1135,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1133,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            fontSize: "11px",
                                                            color: "#666666",
                                                            margin: "0 0 12px",
                                                            lineHeight: "1.4"
                                                        },
                                                        children: mode.desc
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1139,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1132,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    fontSize: "10px",
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "bgTypeSelector",
                                                        checked: bgType === mode.id,
                                                        onChange: ()=>setBgType(mode.id)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1144,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: bgType === mode.id ? "ACTIVE MODE" : "SELECT"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1150,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1143,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, mode.id, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1118,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1091,
                                columnNumber: 13
                            }, this),
                            bgType === "PRODUCT_SPECIFIC" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#F7F7F3",
                                    border: "1px solid #E5E5E5",
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            fontSize: "11px",
                                            letterSpacing: "0.06em"
                                        },
                                        children: "CUSTOM MULTI-BREAKPOINT ASSET PATHS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1159,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                            gap: "16px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "grid",
                                                    gap: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    "Desktop Background URL (1440px+)",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "/assets/environments/custom-desktop.svg",
                                                        value: bgDesktop,
                                                        onChange: (e)=>setBgDesktop(e.target.value),
                                                        style: {
                                                            padding: "10px",
                                                            border: "1px solid #E5E5E5",
                                                            fontFamily: "inherit",
                                                            background: "#FFFFFF"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1163,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1161,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "grid",
                                                    gap: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    "Tablet Background URL (768–1024px)",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "/assets/environments/custom-tablet.svg",
                                                        value: bgTablet,
                                                        onChange: (e)=>setBgTablet(e.target.value),
                                                        style: {
                                                            padding: "10px",
                                                            border: "1px solid #E5E5E5",
                                                            fontFamily: "inherit",
                                                            background: "#FFFFFF"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1174,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1172,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "grid",
                                                    gap: "6px",
                                                    fontSize: "11px",
                                                    fontWeight: 700
                                                },
                                                children: [
                                                    "Mobile Background URL (<768px)",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "/assets/environments/custom-mobile.svg",
                                                        value: bgMobile,
                                                        onChange: (e)=>setBgMobile(e.target.value),
                                                        style: {
                                                            padding: "10px",
                                                            border: "1px solid #E5E5E5",
                                                            fontFamily: "inherit",
                                                            background: "#FFFFFF"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1185,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1183,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1160,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1158,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "14px 18px",
                                    border: "1px dashed #CCCCCC",
                                    background: "#FAFAFA",
                                    fontSize: "11px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "ACTIVE RESOLUTION:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1200,
                                                columnNumber: 17
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: "#000000"
                                                },
                                                children: [
                                                    bgType === "DEFAULT_STUDIO" && "Default BEXYEE Obsidian Studio (/assets/environments/bexyee-studio-neutral.svg)",
                                                    bgType === "COLLECTION" && (formState.cityName === "BENGALURU" ? "Bengaluru Rain Edition Environment (/bengaluru-signal-after-rain.svg)" : `Collection Backdrop (${formState.collection})`),
                                                    bgType === "PRODUCT_SPECIFIC" && `Product-Specific Custom (${bgDesktop || "No URL provided — defaults to neutral studio"})`,
                                                    bgType === "NONE" && "Clean Solid Studio (Zero Image Requests)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1201,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1199,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "10px",
                                            color: "#777777"
                                        },
                                        children: "PREVIEW READY ↗"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1198,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleSaveBackgrounds,
                                disabled: isSaving,
                                style: {
                                    alignSelf: "flex-start",
                                    background: "#000000",
                                    color: "#FFFFFF",
                                    border: "1px solid #000000",
                                    padding: "12px 24px",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    letterSpacing: "0.08em"
                                },
                                children: isSaving ? "PERSISTING..." : "SAVE & PERSIST BACKGROUND CONFIGURATION ↗"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1211,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 1081,
                        columnNumber: 11
                    }, this),
                    activeTab === "LAUNCH" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "9.5px",
                                            color: "#777777",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "SECTION 05 // LAUNCH ENGINE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1236,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            margin: "4px 0 0",
                                            fontSize: "18px"
                                        },
                                        children: "Launch State & Authoritative Purchase Mode"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1237,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: "12px",
                                            color: "#666666",
                                            margin: "4px 0 0"
                                        },
                                        children: "Purchase mode is folded directly into launch state and is strictly evaluated when state is LIVE."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1238,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1235,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    padding: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px",
                                            fontWeight: 800,
                                            letterSpacing: "0.08em"
                                        },
                                        children: "PURCHASE MODE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1245,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                            gap: "16px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "12px",
                                                    padding: "16px",
                                                    border: purchaseMode === "BUY_NOW" ? "2px solid #000000" : "1px solid #E5E5E5",
                                                    background: purchaseMode === "BUY_NOW" ? "#F7F7F3" : "#FFFFFF",
                                                    cursor: "pointer"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "purchaseMode",
                                                        value: "BUY_NOW",
                                                        checked: purchaseMode === "BUY_NOW",
                                                        onChange: ()=>setPurchaseMode("BUY_NOW"),
                                                        style: {
                                                            marginTop: "3px"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1258,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                style: {
                                                                    fontSize: "12px",
                                                                    display: "block",
                                                                    color: "#000000"
                                                                },
                                                                children: "BUY NOW"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1267,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "11px",
                                                                    color: "#666666",
                                                                    display: "block",
                                                                    marginTop: "2px"
                                                                },
                                                                children: "Customer can purchase immediately with real-time stock allocation."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1268,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1266,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1247,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "12px",
                                                    padding: "16px",
                                                    border: purchaseMode === "PREBOOK" ? "2px solid #000000" : "1px solid #E5E5E5",
                                                    background: purchaseMode === "PREBOOK" ? "#F7F7F3" : "#FFFFFF",
                                                    cursor: "pointer"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "purchaseMode",
                                                        value: "PREBOOK",
                                                        checked: purchaseMode === "PREBOOK",
                                                        onChange: ()=>setPurchaseMode("PREBOOK"),
                                                        style: {
                                                            marginTop: "3px"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1285,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                style: {
                                                                    fontSize: "12px",
                                                                    display: "block",
                                                                    color: "#000000"
                                                                },
                                                                children: "PRE-BOOK"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1294,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "11px",
                                                                    color: "#666666",
                                                                    display: "block",
                                                                    marginTop: "2px"
                                                                },
                                                                children: "Customer reserves the product before release with variant-specific limits."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1295,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1293,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1274,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1246,
                                        columnNumber: 15
                                    }, this),
                                    purchaseMode === "PREBOOK" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#F7F7F3",
                                            border: "1px solid #E5E5E5",
                                            borderLeft: "3px solid #E52B20",
                                            padding: "20px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                            marginTop: "8px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                                    gap: "16px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "grid",
                                                            gap: "6px",
                                                            fontSize: "11px",
                                                            fontWeight: 700
                                                        },
                                                        children: [
                                                            "Pre-Book Window Start (IST)",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "datetime-local",
                                                                value: prebookStart,
                                                                onChange: (e)=>setPrebookStart(e.target.value),
                                                                style: {
                                                                    padding: "8px",
                                                                    border: "1px solid #E5E5E5"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1308,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1306,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "grid",
                                                            gap: "6px",
                                                            fontSize: "11px",
                                                            fontWeight: 700
                                                        },
                                                        children: [
                                                            "Pre-Book Window End (IST)",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "datetime-local",
                                                                value: prebookEnd,
                                                                onChange: (e)=>setPrebookEnd(e.target.value),
                                                                style: {
                                                                    padding: "8px",
                                                                    border: "1px solid #E5E5E5"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1318,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1316,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: "grid",
                                                            gap: "6px",
                                                            fontSize: "11px",
                                                            fontWeight: 700
                                                        },
                                                        children: [
                                                            "Expected Fulfillment Estimate",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                placeholder: "e.g. OCTOBER 2026",
                                                                value: fulfillmentEstimate,
                                                                onChange: (e)=>setFulfillmentEstimate(e.target.value),
                                                                style: {
                                                                    padding: "8px",
                                                                    border: "1px solid #E5E5E5"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1328,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1326,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1305,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    borderTop: "1px solid #E5E5E5",
                                                    paddingTop: "16px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "10px",
                                                            color: "#777777",
                                                            letterSpacing: "0.14em",
                                                            textTransform: "uppercase",
                                                            display: "block",
                                                            marginBottom: "12px",
                                                            fontWeight: 800
                                                        },
                                                        children: "VARIANT-SPECIFIC PRE-BOOK LIMITS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1340,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                                                            gap: "14px"
                                                        },
                                                        children: [
                                                            "S",
                                                            "M",
                                                            "L",
                                                            "XL"
                                                        ].map((sizeKey)=>{
                                                            const currentVariant = product.variants.find((v)=>v.size === sizeKey);
                                                            const prebooked = currentVariant?.prebookedCount ?? 0;
                                                            const limit = sizePrebookLimits[sizeKey] ?? 0;
                                                            const remaining = Math.max(0, limit - prebooked);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: "#FFFFFF",
                                                                    border: "1px solid #E5E5E5",
                                                                    padding: "14px",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "8px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                style: {
                                                                                    fontSize: "15px",
                                                                                    color: "#000000"
                                                                                },
                                                                                children: sizeKey
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                                lineNumber: 1353,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: "9px",
                                                                                    fontWeight: 800,
                                                                                    color: remaining === 0 ? "#DC2626" : remaining <= 3 ? "#EA580C" : "#16A34A"
                                                                                },
                                                                                children: remaining === 0 ? "SOLD OUT" : `${remaining} REMAINING`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                                lineNumber: 1354,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                        lineNumber: 1352,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        style: {
                                                                            fontSize: "10.5px",
                                                                            color: "#444444",
                                                                            fontWeight: 700,
                                                                            display: "grid",
                                                                            gap: "4px"
                                                                        },
                                                                        children: [
                                                                            "Pre-book limit",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                value: sizePrebookLimits[sizeKey],
                                                                                onChange: (e)=>setSizePrebookLimits({
                                                                                        ...sizePrebookLimits,
                                                                                        [sizeKey]: parseInt(e.target.value) || 0
                                                                                    }),
                                                                                style: {
                                                                                    padding: "8px",
                                                                                    border: "1px solid #CCCCCC",
                                                                                    fontSize: "12px",
                                                                                    fontFamily: "inherit"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                                lineNumber: 1366,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                        lineNumber: 1364,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: "9.5px",
                                                                            color: "#777777"
                                                                        },
                                                                        children: [
                                                                            "Pre-booked: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: prebooked
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                                lineNumber: 1378,
                                                                                columnNumber: 43
                                                                            }, this),
                                                                            " / ",
                                                                            limit
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                        lineNumber: 1377,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, sizeKey, true, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1351,
                                                                columnNumber: 27
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1343,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1339,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1304,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1244,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#F7F7F3",
                                    border: "1px solid #E5E5E5",
                                    padding: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "10px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "10px",
                                                            color: "#777777",
                                                            letterSpacing: "0.12em",
                                                            display: "block"
                                                        },
                                                        children: "CURRENT LAUNCH STATUS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1393,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        style: {
                                                            fontSize: "16px",
                                                            color: "#000000"
                                                        },
                                                        children: [
                                                            launchStatus,
                                                            " ",
                                                            launchStatus === "LIVE" || launchStatus === "PAUSED" ? `(${purchaseMode})` : ""
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1394,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1392,
                                                columnNumber: 17
                                            }, this),
                                            launchStatus === "PAUSED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "11px",
                                                    background: "#FFFBEB",
                                                    color: "#B45309",
                                                    border: "1px solid #FCD34D",
                                                    padding: "4px 10px",
                                                    fontWeight: 700
                                                },
                                                children: "⚠ Product is temporarily unavailable on storefront."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1397,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1391,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "10px",
                                            flexWrap: "wrap"
                                        },
                                        children: [
                                            launchStatus !== "LIVE" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleSaveLaunchAndPurchaseMode("LIVE"),
                                                disabled: isSaving,
                                                style: {
                                                    background: "#000000",
                                                    border: "1px solid #000000",
                                                    color: "#FFFFFF",
                                                    padding: "10px 18px",
                                                    fontSize: "11px",
                                                    fontWeight: 800,
                                                    cursor: "pointer"
                                                },
                                                children: launchStatus === "PAUSED" ? "RESUME LIVE LAUNCH ↗" : "MAKE LIVE ↗"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1405,
                                                columnNumber: 19
                                            }, this),
                                            launchStatus === "LIVE" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleSaveLaunchAndPurchaseMode("PAUSED"),
                                                disabled: isSaving,
                                                style: {
                                                    background: "#FFFFFF",
                                                    border: "1px solid #E5E5E5",
                                                    color: "#E52B20",
                                                    padding: "10px 18px",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                },
                                                children: "PAUSE LAUNCH"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1416,
                                                columnNumber: 19
                                            }, this),
                                            launchStatus !== "DRAFT" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleSaveLaunchAndPurchaseMode("DRAFT"),
                                                disabled: isSaving,
                                                style: {
                                                    background: "#FFFFFF",
                                                    border: "1px solid #E5E5E5",
                                                    color: "#000000",
                                                    padding: "10px 18px",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                },
                                                children: "MOVE TO DRAFT"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1427,
                                                columnNumber: 19
                                            }, this),
                                            launchStatus !== "ENDED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleSaveLaunchAndPurchaseMode("ENDED"),
                                                disabled: isSaving,
                                                style: {
                                                    background: "#FFFFFF",
                                                    border: "1px solid #E5E5E5",
                                                    color: "#555555",
                                                    padding: "10px 18px",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                },
                                                children: "END DROP"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1438,
                                                columnNumber: 19
                                            }, this),
                                            launchStatus !== "ARCHIVED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleSaveLaunchAndPurchaseMode("ARCHIVED"),
                                                disabled: isSaving,
                                                style: {
                                                    background: "#FFFFFF",
                                                    border: "1px solid #E5E5E5",
                                                    color: "#888888",
                                                    padding: "10px 18px",
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                },
                                                children: "ARCHIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1449,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1403,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1390,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleSaveLaunchAndPurchaseMode(),
                                disabled: isSaving,
                                style: {
                                    alignSelf: "flex-start",
                                    background: "#000000",
                                    color: "#FFFFFF",
                                    border: "1px solid #000000",
                                    padding: "12px 24px",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    cursor: "pointer"
                                },
                                children: "PERSIST LAUNCH & PURCHASE MODE ↗"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1461,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 1234,
                        columnNumber: 11
                    }, this),
                    activeTab === "PREVIEW" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "12px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "9.5px",
                                                    color: "#777777",
                                                    letterSpacing: "0.14em"
                                                },
                                                children: "SECTION 06 // REAL COMPONENT PREVIEW"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1486,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    margin: "4px 0 0",
                                                    fontSize: "18px"
                                                },
                                                children: "Live Multi-Device Storefront Preview"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1487,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1485,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "8px"
                                        },
                                        children: Object.keys(VIEWPORTS).map((vKey)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setViewport(vKey),
                                                style: {
                                                    background: viewport === vKey ? "#000000" : "#FFFFFF",
                                                    color: viewport === vKey ? "#FFFFFF" : "#000000",
                                                    border: "1px solid #E5E5E5",
                                                    padding: "6px 14px",
                                                    fontSize: "10.5px",
                                                    fontWeight: 700,
                                                    cursor: "pointer"
                                                },
                                                children: VIEWPORTS[vKey].label
                                            }, vKey, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1492,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1490,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1484,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: "100%",
                                    overflowX: "auto",
                                    background: "#E5E5E5",
                                    padding: "24px",
                                    display: "flex",
                                    justifyContent: "center"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: VIEWPORTS[viewport].width,
                                        maxWidth: "100%",
                                        background: "#F7F7F3",
                                        border: "1px solid #CCCCCC",
                                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                                        overflow: "hidden"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: "40px 24px",
                                            textAlign: "center"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "10px",
                                                    color: "#777777",
                                                    letterSpacing: "0.14em"
                                                },
                                                children: [
                                                    "BEXYEE // ",
                                                    product.cityName,
                                                    " EDITION"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1525,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                style: {
                                                    fontSize: "36px",
                                                    fontWeight: 900,
                                                    margin: "8px 0"
                                                },
                                                children: product.cityName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1528,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "12px",
                                                    color: "#666666",
                                                    maxWidth: "420px",
                                                    margin: "0 auto"
                                                },
                                                children: product.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1529,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: "24px"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    style: {
                                                        fontSize: "28px"
                                                    },
                                                    children: [
                                                        "₹",
                                                        (product.pricePaise / 100).toLocaleString("en-IN")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1533,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1532,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: "20px"
                                                },
                                                children: product.launch.status === "LIVE" && product.launch.purchaseMode === "PREBOOK" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    style: {
                                                        background: "#000000",
                                                        color: "#FFFFFF",
                                                        padding: "14px 28px",
                                                        fontSize: "11px",
                                                        fontWeight: 800,
                                                        border: 0
                                                    },
                                                    children: "PRE-BOOK NOW ↗"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1537,
                                                    columnNumber: 23
                                                }, this) : product.launch.status === "LIVE" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    style: {
                                                        background: "#000000",
                                                        color: "#FFFFFF",
                                                        padding: "14px 28px",
                                                        fontSize: "11px",
                                                        fontWeight: 800,
                                                        border: 0
                                                    },
                                                    children: "BUY NOW ↗"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1541,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: true,
                                                    style: {
                                                        background: "#999999",
                                                        color: "#FFFFFF",
                                                        padding: "14px 28px",
                                                        fontSize: "11px",
                                                        fontWeight: 800,
                                                        border: 0,
                                                        cursor: "not-allowed"
                                                    },
                                                    children: "SOLD OUT"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1545,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1535,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1524,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 1514,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1513,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 1483,
                        columnNumber: 11
                    }, this),
                    activeTab === "PERFORMANCE" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "9.5px",
                                            color: "#777777",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "SECTION 07 // CONVERSION & COMMERCIALS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1560,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            margin: "4px 0 0",
                                            fontSize: "18px"
                                        },
                                        children: "Live Product Performance"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1561,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1559,
                                columnNumber: 13
                            }, this),
                            analyticsData && analyticsData.views > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #E5E5E5",
                                            padding: "20px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "10px",
                                                    color: "#777777"
                                                },
                                                children: "VIEWS"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1567,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "28px",
                                                    fontWeight: 900
                                                },
                                                children: analyticsData.views
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1568,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1566,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #E5E5E5",
                                            padding: "20px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "10px",
                                                    color: "#777777"
                                                },
                                                children: "ADD TO CART"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1571,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "28px",
                                                    fontWeight: 900
                                                },
                                                children: analyticsData.addToCart
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1572,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1570,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #E5E5E5",
                                            padding: "20px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "10px",
                                                    color: "#777777"
                                                },
                                                children: "CHECKOUTS"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1575,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "28px",
                                                    fontWeight: 900
                                                },
                                                children: analyticsData.checkoutStarts
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1576,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1574,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #E5E5E5",
                                            padding: "20px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "10px",
                                                    color: "#777777"
                                                },
                                                children: "PURCHASES"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1579,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "28px",
                                                    fontWeight: 900
                                                },
                                                children: analyticsData.purchases
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1580,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1578,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: "1px solid #E5E5E5",
                                            padding: "20px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "10px",
                                                    color: "#777777"
                                                },
                                                children: "REVENUE"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1583,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "28px",
                                                    fontWeight: 900
                                                },
                                                children: [
                                                    "₹",
                                                    (analyticsData.revenuePaise / 100).toLocaleString("en-IN")
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1584,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1582,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1565,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#F7F7F3",
                                    border: "1px dashed #CCCCCC",
                                    padding: "48px 24px",
                                    textAlign: "center",
                                    color: "#777777"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            fontSize: "14px",
                                            color: "#000000",
                                            display: "block",
                                            marginBottom: "4px"
                                        },
                                        children: "NO DATA AVAILABLE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1589,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px"
                                        },
                                        children: "No real customer engagement events have been recorded for this SKU yet."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1592,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1588,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 1558,
                        columnNumber: 11
                    }, this),
                    activeTab === "ACTIVITY" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFFFF",
                            border: "1px solid #E5E5E5",
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "9.5px",
                                            color: "#777777",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "SECTION 08 // AUDIT LOG"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1602,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            margin: "4px 0 0",
                                            fontSize: "18px"
                                        },
                                        children: "Historical Mutation Feed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1603,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1601,
                                columnNumber: 13
                            }, this),
                            auditLogs && auditLogs.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    border: "1px solid #E5E5E5",
                                    overflowX: "auto"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    style: {
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontSize: "11.5px",
                                        textAlign: "left"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    background: "#F7F7F3",
                                                    borderBottom: "1px solid #E5E5E5"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "10px 14px",
                                                            color: "#777777"
                                                        },
                                                        children: "ACTION"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1611,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "10px 14px",
                                                            color: "#777777"
                                                        },
                                                        children: "PERFORMED BY"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1612,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "10px 14px",
                                                            color: "#777777"
                                                        },
                                                        children: "TIMESTAMP (UTC)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1613,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: "10px 14px",
                                                            color: "#777777"
                                                        },
                                                        children: "DETAILS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                        lineNumber: 1614,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                lineNumber: 1610,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 1609,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: auditLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        borderBottom: "1px solid #F0F0EE"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "12px 14px",
                                                                fontWeight: 700
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    background: "#000000",
                                                                    color: "#FFFFFF",
                                                                    padding: "2px 6px",
                                                                    fontSize: "9px"
                                                                },
                                                                children: log.action
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                                lineNumber: 1621,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1620,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "12px 14px",
                                                                color: "#555555"
                                                            },
                                                            children: log.performed_by || "System"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1625,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "12px 14px",
                                                                color: "#777777"
                                                            },
                                                            children: new Date(log.created_at).toLocaleString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1626,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: "12px 14px",
                                                                color: "#333333"
                                                            },
                                                            children: JSON.stringify(log.metadata || {})
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                            lineNumber: 1627,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, log.id, true, {
                                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                                    lineNumber: 1619,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                            lineNumber: 1617,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                    lineNumber: 1608,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1607,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#F7F7F3",
                                    border: "1px dashed #CCCCCC",
                                    padding: "48px 24px",
                                    textAlign: "center",
                                    color: "#777777"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            fontSize: "14px",
                                            color: "#000000",
                                            display: "block",
                                            marginBottom: "4px"
                                        },
                                        children: "NO AUDIT ACTIVITY RECORDED YET"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1635,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "11px"
                                        },
                                        children: "All future price updates, stock changes, and launch toggles will be immutably tracked here."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                        lineNumber: 1638,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                                lineNumber: 1634,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                        lineNumber: 1600,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
                lineNumber: 683,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/ProductControlCenter.tsx",
        lineNumber: 440,
        columnNumber: 5
    }, this);
}
_s(ProductControlCenter, "TUct1gGh4S5jutjUIh1onMQrDuQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProductControlCenter;
var _c;
__turbopack_context__.k.register(_c, "ProductControlCenter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_admin_ProductControlCenter_tsx_17xg5yr._.js.map