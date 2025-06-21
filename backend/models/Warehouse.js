import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    enum: [
      // Departamento de Amazonas
      'Chachapoyas', 'Bagua', 'Bongará', 'Condorcanqui', 'Luya', 'Rodríguez de Mendoza', 'Utcubamba',
      // Departamento de Áncash
      'Huaraz', 'Aija', 'Antonio Raymondi', 'Asunción', 'Bolognesi', 'Carhuaz', 'Carlos Fermín Fitzcarrald',
      'Casma', 'Corongo', 'Huari', 'Huarmey', 'Huaylas', 'Mariscal Luzuriaga', 'Ocros', 'Pallasca',
      'Pomabamba', 'Recuay', 'Santa', 'Sihuas', 'Yungay',
      // Departamento de Apurímac
      'Abancay', 'Andahuaylas', 'Antabamba', 'Aymaraes', 'Cotabambas', 'Chincheros', 'Grau',
      // Departamento de Arequipa
      'Arequipa', 'Camaná', 'Caravelí', 'Castilla', 'Caylloma', 'Condesuyos', 'Islay', 'La Unión',
      // Departamento de Ayacucho
      'Huamanga', 'Cangallo', 'Huanca Sancos', 'Huanta', 'La Mar', 'Lucanas', 'Parinacochas',
      'Páucar del Sara Sara', 'Sucre', 'Víctor Fajardo', 'Vilcas Huamán',
      // Departamento de Cajamarca
      'Cajamarca', 'Cajabamba', 'Celendín', 'Chota', 'Contumazá', 'Cutervo', 'Hualgayoc',
      'Jaén', 'San Ignacio', 'San Marcos', 'San Miguel', 'San Pablo', 'Santa Cruz',
      // Departamento del Callao
      'Callao',
      // Departamento de Cusco
      'Cusco', 'Acomayo', 'Anta', 'Calca', 'Canas', 'Canchis', 'Chumbivilcas', 'Espinar',
      'La Convención', 'Paruro', 'Paucartambo', 'Quispicanchi', 'Urubamba',
      // Departamento de Huancavelica
      'Huancavelica', 'Acobamba', 'Angaraes', 'Castrovirreyna', 'Churcampa', 'Colcabamba', 'Huaytará', 'Tayacaja',
      // Departamento de Huánuco
      'Huánuco', 'Ambo', 'Dos de Mayo', 'Huacaybamba', 'Huamalíes', 'Leoncio Prado', 'Marañón',
      'Pachitea', 'Puerto Inca', 'Lauricocha', 'Yarowilca',
      // Departamento de Ica
      'Ica', 'Chincha', 'Nazca', 'Palpa', 'Pisco',
      // Departamento de Junín
      'Huancayo', 'Concepción', 'Chanchamayo', 'Jauja', 'Junín', 'Satipo', 'Tarma', 'Yauli', 'Chupaca',
      // Departamento de La Libertad
      'Trujillo', 'Ascope', 'Bolívar', 'Chepén', 'Julcán', 'Otuzco', 'Pacasmayo', 'Pataz',
      'Sánchez Carrión', 'Santiago de Chuco', 'Gran Chimú', 'Virú',
      // Departamento de Lambayeque
      'Chiclayo', 'Ferreñafe', 'Lambayeque',
      // Departamento de Lima
      'Lima', 'Barranca', 'Cajatambo', 'Canta', 'Cañete', 'Huaral', 'Huarochirí', 'Huaura', 'Oyón', 'Yauyos',
      // Departamento de Loreto
      'Iquitos', 'Alto Amazonas', 'Loreto', 'Mariscal Ramón Castilla', 'Maynas', 'Requena', 'Ucayali', 'Datem del Marañón',
      // Departamento de Madre de Dios
      'Puerto Maldonado', 'Manu', 'Tahuamanu',
      // Departamento de Moquegua
      'Mariscal Nieto', 'General Sánchez Cerro', 'Ilo',
      // Departamento de Pasco
      'Pasco', 'Daniel Alcides Carrión', 'Oxapampa',
      // Departamento de Piura
      'Piura', 'Ayabaca', 'Huancabamba', 'Morropón', 'Paita', 'Sullana', 'Talara', 'Sechura',
      // Departamento de Puno
      'Puno', 'Azángaro', 'Carabaya', 'Chucuito', 'El Collao', 'Huancané', 'Lampa', 'Melgar',
      'Moho', 'San Antonio de Putina', 'San Román', 'Sandia', 'Yunguyo',
      // Departamento de San Martín
      'Moyobamba', 'Bellavista', 'El Dorado', 'Huallaga', 'Lamas', 'Mariscal Cáceres',
      'Picota', 'Rioja', 'San Martín', 'Tocache',
      // Departamento de Tacna
      'Tacna', 'Candarave', 'Jorge Basadre', 'Tarata',
      // Departamento de Tumbes
      'Tumbes', 'Contralmirante Villar', 'Zarumilla',
      // Departamento de Ucayali
      'Coronel Portillo', 'Atalaya', 'Padre Abad', 'Purús'
    ]
  }
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;