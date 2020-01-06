#include  <iostream>
#include  <fstream>
#include <vector>
#pragma pack(push, 1);
//文件头
struct BMPFileHeader {
    __uint16_t  file_type{ 0x4D42 };     //文件类型 ***
    __uint32_t file_size{ 0 };          //文件大小以字节为单位  *** 像素数据+文件头+信息头
    __uint16_t reserved1{ 0 };
    __uint16_t reserved2{ 0 };
    __uint32_t offset_data{ 0 };
};
struct BMPInfoHeader {
    __uint32_t size{ 0 };            //信息头结构体占用字节数
    __int32_t width{ 0 };            //图像的宽度   *** 像素为单位
    __int32_t height{ 0 };           //图像的高度   *** 像素为单位


    __uint16_t planes{ 1 };
    __uint16_t bit_count{ 0 };      //每一个像素点占用的字节数  ***  24个字节 三个uint8_t数据
    __uint32_t compression{ 0 };    //是否压缩
    __uint32_t size_image{ 0 };     //像素数据大小  *** 以字节为单位
    __int32_t x_pixels_per_meter{ 0 };   //分辨率 每米几个像素点
    __int32_t y_pixels_per_meter{ 0 };   //分辨率 同上
    __uint32_t colors_used{ 0 };
    __uint32_t colors_important{ 0 };
};
//调色板
struct BMPColorHeader {
    __uint32_t red_mask{ 0x00ff0000 };
    __uint32_t green_mask{ 0x0000ff00 };
    __uint32_t blue_mask{ 0x000000ff };
    __uint32_t alpha_mask{ 0xff000000 };
    __uint32_t color_space_type{ 0x73524742 };
    __uint32_t unused[16]{ 0 };
};
//像素点结构体
struct BMPPixel {
    __uint8_t blue;
    __uint8_t green;
    __uint8_t red;
};
#pragma pack(pop)

struct BMP {
    BMPFileHeader file_header;
    BMPInfoHeader bmp_info_header;
    BMPColorHeader bmp_color_header;
    std::vector<uint8_t> data;   //用来保存像素数据以字节为单位
    std::vector<struct BMPPixel> PIXEL_B;   //将像素的字节数据规格化为 每三个字节为一个像素点而用到的链表

    BMP(const char *filename) {
        read(filename);
    }
    BMPInfoHeader* getBmp_info_header()
    {
        return  &bmp_info_header;
    }
    std::vector<uint8_t>* getData()
    {
        return &data;
    }
    void read(const char *filename) {
        std::ifstream inp{ filename, std::ios_base::binary };
        if (inp) {
            inp.read((char*)&file_header, sizeof(file_header));
            if(file_header.file_type != 0x4D42) {
                throw std::runtime_error("Is Not BMP File!");
            }
            inp.read((char*)&bmp_info_header, sizeof(bmp_info_header));

            // 跳转至读取像素点数据的位置
            inp.seekg(file_header.offset_data, inp.beg);

            if (bmp_info_header.height < 0) {
                throw std::runtime_error("The BMP is too small");
            }

            data.resize(bmp_info_header.width * bmp_info_header.height * bmp_info_header.bit_count / 8);

            // 检查是否需要在读取的时候附加几行  windows只能以4个字节为单位进行读取
            if (bmp_info_header.width % 4 == 0) {
                inp.read((char*)data.data(), data.size());
                file_header.file_size += data.size();
            }
            else{
                row_stride = bmp_info_header.width * bmp_info_header.bit_count / 8;  //一行有多少个字节
                uint32_t new_stride = make_stride_aligned(4);                        //字节数不是4的倍数则进行补充
                std::vector<uint8_t> padding_row(new_stride - row_stride);

                //按行读取  row_stride表示指针位置
                for (int y = 0; y < bmp_info_header.height; ++y) {
                    inp.read((char*)(data.data() + row_stride * y), row_stride);
                    inp.read((char*)padding_row.data(), padding_row.size());
                }

                //更新文件大小
                file_header.file_size += data.size() + bmp_info_header.height * padding_row.size();
            }
            //将像素点位数据点化 方便用坐标进行矩阵转化   8位图直接直接保存在另一个序列中，24位图则进行划分3个一组保存在序列中
            for (int i=0;i<data.size();i++) {
                struct BMPPixel a_pixel;
                a_pixel.blue=data.at(i);
                a_pixel.green=data.at(i+1);
                a_pixel.red=data.at(i+2);
                PIXEL_B.push_back(a_pixel);
                i=i+2;
            }
        }else {
            throw std::runtime_error("Unable to open the input image file.");
        }
    }

    void write(const char *fname) {
        std::ofstream of{ fname, std::ios_base::binary };
        if (of) {
            if (bmp_info_header.bit_count == 32) {
                write_headers_and_data(of);
            }
            else if (bmp_info_header.bit_count ==24||bmp_info_header.bit_count ==8) {
                if (bmp_info_header.width % 4 == 0) {
                    write_headers_and_data(of);
                }
                else {
                    //长和宽交换之后图片的宽度可能不是4的倍数则需要进行追加字节输入
                    row_stride = bmp_info_header.width*bmp_info_header.bit_count / 8;
                    uint32_t new_stride = make_stride_aligned(4);
                    std::vector<uint8_t> padding_row(new_stride - row_stride);

                    write_headers(of);

                    for (int y = 0; y < bmp_info_header.height; ++y) {
                        of.write((const char*)(data.data() + row_stride * y), row_stride);
                        of.write((const char*)padding_row.data(), padding_row.size());
                    }
                }
                std::cout<<"over!";
            }
            else {
                throw std::runtime_error("Error!");
            }
        }
        else {
            throw std::runtime_error("Unable to open the output image file.");
        }
    }

    void rotate_copyBMP()
    {
        int h=bmp_info_header.height;
        int w=bmp_info_header.width;
        data.clear();
        //清除原来的像素点字节数据  腾出用于重新读入像素点字节数据
        for (int i=0;i<w;i++) {
            int x_row=i%w;        //得到原x坐标
            for (int y_cloumn=h-1;y_cloumn>-1;y_cloumn--) {
                data.push_back(PIXEL_B.at(y_cloumn*w+x_row).blue);
                data.push_back(PIXEL_B.at(y_cloumn*w+x_row).green);
                data.push_back(PIXEL_B.at(y_cloumn*w+x_row).red);
            }
        }
        //将图像的长和宽交换
        bmp_info_header.width=h;
        bmp_info_header.height=w;
    }
private:
    uint32_t row_stride{ 0 };
    //windows只能4个字节的读取 24位图一个像素占3个字节  在读取时无法以4个字节读取时需要增加一些字节单位

    void write_headers(std::ofstream &of) {
        of.write((const char*)&file_header, sizeof(file_header));
        of.write((const char*)&bmp_info_header, sizeof(bmp_info_header));
        if(bmp_info_header.bit_count == 32) {
            of.write((const char*)&bmp_color_header, sizeof(bmp_color_header));
        }
    }

    void write_headers_and_data(std::ofstream &of) {
        write_headers(of);
        of.write((const char*)data.data(), data.size());
    }

    // 字节补充
    uint32_t make_stride_aligned(uint32_t align_stride) {
        uint32_t new_stride = row_stride;
        while (new_stride % align_stride != 0) {
            new_stride++;
        }
        return new_stride;
    }
};
int main(int argc,char *argv[])
{
	BMP bmp0("./pic/map.bmp");
	bmp0.rotate_copyBMP();
	bmp0.write("./pic/map_copy.bmp");
	return 0;

}