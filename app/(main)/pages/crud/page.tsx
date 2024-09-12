/* eslint-disable @next/next/no-img-element */
'use client';
import { RegistryService } from '@/services/RegistryService';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';


/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyRegistry: Projeto.Registry = {
        value: 0,
        id: undefined,
        description: '',
        period: '',
        person: 'TI',
        status: 'RECEBIDO',
        type: 'REVENUE'
    };

    const [registries, setRegistries] = useState<Projeto.Registry[]>([]);
    const [registryDialog, setRegistryDialog] = useState(false);
    const [deleteRegistryDialog, setDeleteRegistryDialog] = useState(false);
    const [deleteRegistriesDialog, setDeleteRegistriesDialog] = useState(false);
    const [registry, setRegistry] = useState<Projeto.Registry>(emptyRegistry);
    const [selectedRegistries, setSelectedRegistries] = useState<Projeto.Registry[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const registryService = new RegistryService();



    useEffect(() => {
        if (registries.length == 0) {
            registryService.findall().then((response) => {
                setRegistries(response.data)
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [registries]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const openNew = () => {
        setRegistry(emptyRegistry);
        setSubmitted(false);
        setRegistryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRegistryDialog(false);
    };

    const hideDeleteRegistryDialog = () => {
        setDeleteRegistryDialog(false);
    };

    const hideDeleteRegistriesDialog = () => {
        setDeleteRegistriesDialog(false);
    };

    const saveRegistry = () => {
        setSubmitted(true);


        registryService.create(registry).then((response) => {
            setRegistryDialog(false);
            setRegistry(emptyRegistry);
            setRegistries([]);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Registro criado',
                life: 3000
            })
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.message,
                life: 3000
            })
        })
    };

    const editRegistry = (registry: Projeto.Registry) => {
        setRegistry({ ...registry });
        setRegistryDialog(true);
    };

    const confirmDeleteRegistry = (registry: Projeto.Registry) => {
        setRegistry(registry);
        setDeleteRegistryDialog(true);
    };

    const deleteRegistry = () => {
        registryService.delete(registry.id!).then((response) => {
            setDeleteRegistriesDialog(false);
            setRegistry(emptyRegistry);
            setRegistries([]);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Registro excluído',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.message,
                life: 3000
            });
        });

    };



    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteRegistriesDialog(true);
    };

    const deleteSelectedRegistries = () => {
        selectedRegistries.forEach((registry: Projeto.Registry) => {
            if (registry.id) {
                registryService.delete(registry.id)
                    .then((response) => {
                        setDeleteRegistriesDialog(false);
                        setRegistries(registries.filter((r) => r.id !== registry.id));
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Registro excluído',
                            life: 3000
                        });
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Erro',
                            detail: error.message,
                            life: 3000
                        });
                    });
            }
        });
        setSelectedRegistries([]);
    };

    const onPersonChange = (e: RadioButtonChangeEvent) => {
        let _registry = { ...registry };
        _registry['person'] = e.value;
        setRegistry(_registry);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _registry = { ...registry };
        _registry[`${name}`] = val;

        setRegistry(_registry);
    };

    // const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    //     const val = e.value || 0;
    //     let _registry = { ...registry };
    //     _registry[`${name}`] = val;

    //     setRegistry(_registry);
    // };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRegistries || !(selectedRegistries as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const descriptionBodyTemplate = (rowData: Projeto.Registry) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
            </>
        );
    };

    const periodBodyTemplate = (rowData: Projeto.Registry) => {
        return (
            <>
                <span className="p-column-title">Period</span>
                {rowData.period}
            </>
        );
    };

    const personBodyTemplate = (rowData: Projeto.Registry) => {
        return (
            <>
                <span className="p-column-title">Person</span>
                {rowData.person}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Projeto.Registry) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.status}
            </>
        );
    };

    const typeBodyTemplate = (rowData: Projeto.Registry) => {
        return (
            <>
                <span className="p-column-title">Type</span>
                {rowData.type}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Registry) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRegistry(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRegistry(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Registries</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );

    const registryDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveRegistry} />
        </>
    );
    const deleteRegistryDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRegistryDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteRegistry} />
        </>
    );
    const deleteRegistriesDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteRegistriesDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedRegistries} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={registries}
                        selection={selectedRegistries}
                        onSelectionChange={(e) => setSelectedRegistries(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} registros"
                        globalFilter={globalFilter}
                        emptyMessage="Registros não encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="description" header="Descrição" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="period" header="Período" sortable body={periodBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="person" header="Pessoa" sortable body={personBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="type" header="Tipo" sortable body={typeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={registryDialog} style={{ width: '450px' }} header="Detalhes do registro" modal className="p-fluid" footer={registryDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={registry.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label htmlFor="period">Período</label>
                            <InputText id="period" value={registry.period} onChange={(e) => onInputChange(e, 'period')} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Pessoa</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="person1" name="person" value="TI" onChange={onPersonChange} checked={registry.person === 'TI'} />
                                    <label htmlFor="person1">TI</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="person2" name="person" value="GABI" onChange={onPersonChange} checked={registry.person === 'GABI'} />
                                    <label htmlFor="person2">GABI</label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <InputText id="status" value={registry.status} onChange={(e) => onInputChange(e, 'status')} />
                        </div>

                        <div className="field">
                            <label htmlFor="type">Tipo</label>
                            <InputText id="type" value={registry.type} onChange={(e) => onInputChange(e, 'type')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRegistryDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteRegistryDialogFooter} onHide={hideDeleteRegistryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {registry && (
                                <span>
                                    Certeza que quer excluir <b>{registry.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRegistriesDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteRegistriesDialogFooter} onHide={hideDeleteRegistriesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {registry && <span>Certeza que deseja excluir os registros selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;


