import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const RejectionCodeForm = ({ onSubmit, initialData, existingCategories }) => {
    const [codeId, setCodeId] = useState('');
    const [codeNumber, setCodeNumber] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryField, setShowNewCategoryField] = useState(false);

    useEffect(() => {
        if (initialData) {
            setCodeId(initialData.codeId);
            setCodeNumber(initialData.codeNumber);
            setCategory(initialData.category);
            setDescription(initialData.description);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCategory = showNewCategoryField ? newCategory : category;
        onSubmit({ codeId, codeNumber, category: finalCategory, description });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Code ID"
                        value={codeId}
                        onChange={(e) => setCodeId(e.target.value)}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Code Number"
                        value={codeNumber}
                        onChange={(e) => setCodeNumber(e.target.value)}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    {showNewCategoryField ? (
                        <TextField
                            label="New Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            fullWidth
                            required
                        />
                    ) : (
                        <TextField
                            label="Category"
                            select
                            SelectProps={{
                                native: true,
                            }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            fullWidth
                        >
                            {existingCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </TextField>
                    )}
                    <IconButton
                        onClick={() => setShowNewCategoryField(!showNewCategoryField)}
                        color="primary"
                    >
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default RejectionCodeForm;