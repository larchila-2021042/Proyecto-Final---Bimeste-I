//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole, checkAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getUsuarios);

router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    esAdminRole,
    //tieneRole('ADMIN_ROLE', 'SUPERADMIN_ROLE', 'COORDINADOR_ROLE'),
    check('rol').custom(esRoleValido),
    validarCampos,
], postUsuario);

router.post('/agregarCliente', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').default('CLIENTE_ROLE').custom(esRoleValido),
    validarCampos,
], postUsuario);

router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    //check('rol').custom(esRoleValido),
    //tieneRole('ADMIN_ROLE', 'CLIENTE_ROLE', 'COORDINADOR_ROLE'),
    checkAdminRole,
    validarCampos
], putUsuario);

router.put('/editarCliente/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    //check('rol').custom(esRoleValido),
    //tieneRole('ADMIN_ROLE', 'CLIENTE_ROLE', 'COORDINADOR_ROLE'),
    checkAdminRole,
    validarCampos
], putUsuario);

router.delete('/eliminarCliente/:id', [
    validarJWT,
    //tieneRole('ADMIN_ROLE', 'SUPERADMIN_ROLE', 'COORDINADOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    checkAdminRole,
    validarCampos
], deleteUsuario);


router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE', 'SUPERADMIN_ROLE', 'COORDINADOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    checkAdminRole,
    validarCampos
], deleteUsuario);


module.exports = router;


// ROUTES